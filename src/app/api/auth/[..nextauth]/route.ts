import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Optionally restrict domain
      // if (profile.email?.endsWith('@acowale.com')) return true;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Attach user info to token on first login
        const db = await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.userId = dbUser._id.toString();
        } else {
          // Create user if not exists
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'admin', // first user becomes admin; adjust logic as needed
          });
          token.role = newUser.role;
          token.userId = newUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };