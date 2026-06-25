import { ArrowUpRight } from "lucide-react";

export default function MetricCard({ title, value, icon, isTrendCard = false, isNegative = false }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  isTrendCard?: boolean;
  isNegative?: boolean;
}) {
  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 relative group hover:border-slate-800 transition-colors duration-300">
      <div className="absolute top-4 right-4 w-7 h-7 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950 text-slate-400 group-hover:text-white transition-colors">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs tracking-wide text-slate-400 font-light uppercase">{title}</span>
      </div>

      <div className="flex items-baseline space-x-3">
        <span className={`text-3xl font-bold tracking-tight ${
          isTrendCard 
            ? (isNegative ? "text-indigo-400" : "text-cyan-400") 
            : "text-white"
        }`}>
          {value}
        </span>

        {isTrendCard && (
          <span className="text-xs text-slate-500 font-light lowercase">
            vs last month
          </span>
        )}
      </div>
    </div>
  );
}