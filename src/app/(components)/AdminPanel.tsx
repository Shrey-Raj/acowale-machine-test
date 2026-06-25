"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardMetrics, Feedback } from "../../../types/admin";
import AdminHeader from "./AdminHeader";
import Overview from "./Overview";
import FeedbackList from "./FeedbackList";

export default function AdminPanel() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"overview" | "feedbacks">("overview");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const metricsRes = await fetch("/api/admin/fetch-analytics-summary");
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.data);

      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-sans">
        <div className="animate-pulse tracking-widest text-sm text-cyan-400">
          LOADING METRICS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans antialiased flex flex-col p-4 md:p-8 select-none">
      
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 pt-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Overview metrics={metrics} />
            </motion.div>
          ) : (
            <motion.div
              key="feedbacks"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FeedbackList />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}