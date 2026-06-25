import NextAuth, {
  AuthOptions,
  Account,
  Profile,
  User as NextAuthUser,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { cookies } from "next/headers";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const cookieStore = await cookies();
      const selectedRole = cookieStore.get("selectedRole")?.value;

      cookieStore.delete("selectedRole");

      await connectToDatabase();

      if (!selectedRole) return false;

      const dbUser = await User.findOne({ email: user.email });
      if (dbUser) {
        if (dbUser.role !== selectedRole) {
          return false;
          // throw new Error("ROLE_MISMATCH");
        }
        return true;
      }

      await User.create({
        email: user.email,
        name: user.name,
        image: user.image,
        role: selectedRole,
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.role = dbUser.role;
          token.userId = dbUser._id.toString();
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
