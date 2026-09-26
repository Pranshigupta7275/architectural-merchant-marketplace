
import { motion } from "framer-motion";
import { DollarSign, Star } from "lucide-react";
import Badge from "../ui/Badge"; // This path is correct because StatsCard is in components/dashboard/

export default function StatsCard({ data, index }) {
  const renderContent = () => {
    switch (data.type) {
      case "revenue":
        return (
          <div className="relative">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {data.title}
            </p>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-[#111827] tracking-tight">
                {data.value}
              </span>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">{data.badge}</Badge>
                <span className="text-xs text-slate-500">{data.badgeText}</span>
              </div>
            </div>
            {/* Watermark Icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <DollarSign className="w-32 h-32" />
            </div>
          </div>
        );

      case "listings":
        return (
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {data.title}
            </p>
            <span className="text-5xl font-bold text-[#111827] tracking-tight">
              {data.value}
            </span>
            <p className="text-sm text-slate-500 mt-2">{data.subtitle}</p>
          </div>
        );

      case "satisfaction":
        return (
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {data.title}
            </p>
            <span className="text-5xl font-bold text-[#111827] tracking-tight">
              {data.value}
            </span>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-emerald-500 text-emerald-500"
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm overflow-hidden"
    >
      {renderContent()}
    </motion.div>
  );
}
