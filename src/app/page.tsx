import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
      redirect('/dashboard');
    }

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-[#f8fafc]">
      
      <header className="px-6 h-16 flex items-center border-b border-[#1e293b] bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center space-x-2" href="#">
          <Layers className="h-5 w-5 text-[#818cf8]" />
          <span className="font-bold tracking-tight text-xl text-[#f1f5f9]">
            acowale
          </span>
        </Link>
        <nav className="ml-auto">
          <Link href="/login">
            <Button variant="outline" className="border-[#334155] bg-transparent text-[#e2e8f0] hover:bg-[#1e293b] hover:text-white">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4f46e5]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-2xl text-center space-y-6 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            Welcome to{" "}
            <span className="bg-linear-to-r from-[#818cf8] via-[#38bdf8] to-[#fcd34d] bg-clip-text text-transparent">
              acowale
            </span>
          </h1>

          <p className="text-[#94a3b8] text-base md:text-lg max-w-md mx-auto leading-relaxed">
            A secure, modern workspace built for lightning-fast performance and seamless collaboration.
          </p>

          <div className="pt-4">
            <Link href="/login">
              <Button className="px-8 py-6 text-md bg-gradient-to-r from-[#4f46e5] to-[#0284c7] hover:from-[#4338ca] hover:to-[#0369a1] text-white font-medium shadow-lg shadow-[#4f46e5]/20 transition-all transform hover:-translate-y-0.5 group border-0">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 border-t border-[#1e293b] text-center text-xs text-[#64748b]">
        <p>© 2026 acowale. All rights reserved.</p>
      </footer>

    </div>
  );
}