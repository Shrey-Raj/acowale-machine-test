import { motion } from "framer-motion";
import { Feedback } from "../../../types/admin";

export default function FeedbackItem({ item }: { item: Feedback }) {
  return (
    <motion.div 
      layout
      className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-950/60 transition-colors"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        <p className="text-sm text-slate-200 font-light leading-relaxed max-w-3xl">
          “{item.comments}”
        </p>
      </div>

      <div className="text-left md:text-right min-w-[200px] flex flex-col justify-between space-y-1">
        <div className="text-xs text-slate-300 font-medium truncate">
          {item.email || <span className="text-slate-600 italic">Anonymous Source</span>}
        </div>
        <div className="text-[11px] text-slate-500 font-light">
          {new Date(item.createdAt).toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}