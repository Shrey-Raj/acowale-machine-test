"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { DashboardMetrics } from "../../../types/admin";
import MetricCard from "./MetricCard";

interface Props {
  metrics: DashboardMetrics | null;
}

export default function Overview({ metrics }: Props) {
  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-normal font-serif tracking-tight text-white">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, Admin!
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-light">
            Let&apos;s see your current system health data work today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Feedbacks Received"
          value={(metrics?.totalFeedbacks)?.toLocaleString() ?? "0"}
          icon={<MessageSquare className="w-4 h-4 text-blue-400" />}
        />

        <MetricCard
          title="Total Authenticated Users"
          value={(metrics?.totalUsers)?.toLocaleString() ?? "0"}
          icon={<Users className="w-4 h-4 text-cyan-400" />}
        />

        <MetricCard
          title="MoM Feedback Velocity"
          value={metrics?.feedbackGrowth ?? "0.00%"}
          isTrendCard
          isNegative={metrics?.feedbackGrowth?.startsWith("-")}
          icon={<TrendingUp className="w-4 h-4 text-indigo-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <OverviewChart data={metrics?.historicalData} />
        <CategoryDistribution data={metrics?.categoryDistribution} />
      </div>
    </div>
  );
}

function OverviewChart({ data }: { data?: DashboardMetrics["historicalData"] }) {
  return (
    <div className="lg:col-span-8 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center pb-6">
        <div>
          <h3 className="text-lg font-medium text-white tracking-tight">
            System Intake Metrics
          </h3>
          <p className="text-xs text-slate-500">
            Volume distribution curves calculated over consecutive runtime months
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <Legend color="bg-blue-500" label="Feedbacks" />
          <Legend color="bg-cyan-400" label="Users" />
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            
            <defs>
              <linearGradient id="colorFeedbacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderColor: "#1e293b",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="feedbacks"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFeedbacks)"
            />

            <Area
              type="monotone"
              dataKey="users"
              stroke="#22d3ee"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CategoryDistribution({
  data,
}: {
  data?: DashboardMetrics["categoryDistribution"];
}) {
  return (
    <div className="lg:col-span-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
      
      <div>
        <h3 className="text-md font-medium text-white tracking-tight mb-1">
          Feedback Categories
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Inbound tracking distribution sorted by category metadata
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {data?.map((item: { name: string; value: number }, idx: number) => (
          <div key={idx} className="space-y-1.5">
            
            <div className="flex justify-between text-xs font-light">
              <span className="text-slate-300">{item.name}</span>
              <span className="text-cyan-400 font-medium">
                {item.value}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-slate-400">{label}</span>
    </div>
  );
}