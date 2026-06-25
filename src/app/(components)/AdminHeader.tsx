"use client";

import { Layers, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Props } from "../../../types/admin";

export default function AdminHeader({ activeTab, setActiveTab }: Props) {
  return (
    <header className="w-full flex justify-between items-center pb-8 border-b border-slate-900">
      
      
      <div className="flex items-center space-x-3">
        <Layers className="h-6 w-6 text-cyan-400" />
        <span className="font-bold text-xl text-white">Acowale</span>
      </div>

      <nav className="relative flex space-x-1 bg-slate-950 p-1.5 rounded-full border border-slate-900">
        
        {["overview", "feedbacks"].map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Props["activeTab"])}
              className={`relative px-4 py-1.5 text-sm rounded-full transition-colors z-10 ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute inset-0 bg-slate-800 rounded-full"
                />
              )}

              <span className="relative capitalize">{tab}</span>
            </button>
          );
        })}
      </nav>

      <Button onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="w-3.5 h-3.5 mr-2" />
        Sign Out
      </Button>
    </header>
  );
}