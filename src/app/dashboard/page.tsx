"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "../(components)/FeedbackForm";
import AdminPanel from "../(components)/AdminPanel";
import { Layers } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans antialiased flex flex-col justify-between p-6 md:p-12 md:pb-0 selection:bg-white selection:text-black">
      
      {!isAdmin && (<header className="w-full flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
        <Layers className="h-6 w-6 text-cyan-400" />
        <span className="font-bold text-xl text-white">Acowale</span>
      </div>
        <nav className="flex items-center space-x-8 text-sm text-gray-400 font-medium">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-gray-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded-full text-xs px-4"
          >
            Sign Out
          </Button>
        </nav>
      </header>) }

      {isAdmin ? (
        <AdminPanel />
      ) : (
        <main className="w-full max-w-7xl mx-auto pt-12 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
          <div className="lg:col-span-5 space-y-6 relative">
            <div className="absolute -top-10 -left-6 w-[110%] h-[130%] border border-neutral-800 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] pointer-events-none opacity-40 hidden md:block" />
            
            <div className="absolute -top-6 left-12 text-white font-serif text-xl opacity-80">✦</div>
            <div className="absolute bottom-4 right-12 text-white font-serif text-xl opacity-80">✦</div>

            <h2 className="text-4xl md:text-6xl font-normal font-serif tracking-tight leading-[1.1] max-w-md relative z-10">
              We&apos;d love to hear your thoughts
              <span className="text-neutral-500 font-sans">*</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed max-w-sm relative z-10">
              Tell us about your feedback: how can we improve? We&apos;d love to
              stay in touch with you, so we are always ready to answer any
              question that interests you.
            </p>
          </div>

          <div className="lg:col-span-7 w-full">
            <FeedbackForm />
          </div>
        </main>
      )}
    </div>
  );
}