import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { topCollectionData } from "../../data/mockData";

export default function TopCollection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-3xl border border-border-card shadow-card h-105 overflow-hidden flex flex-col"
    >
      {/* Image Banner */}
      <div className="h-44 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20fill%3D%22%23222%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3Crect%20fill%3D%22%23333%22%20x%3D%2250%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3Crect%20fill%3D%22%23333%22%20y%3D%2250%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3Crect%20fill%3D%22%23222%22%20x%3D%2250%22%20y%3D%2250%22%20width%3D%2250%22%20height%3D%2250%22%2F%3E%3C%2Fsvg%3E')] opacity-20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/60 to-transparent">
          <h4 className="text-white text-xl font-bold tracking-tight">
            {topCollectionData.title}
          </h4>
          <p className="text-white/70 text-sm mt-1">
            {topCollectionData.activeSKUs} Active SKUs
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Conversion Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">Conversion Rate</span>
              <span className="text-sm font-semibold text-text-primary">
                {topCollectionData.conversionRate}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topCollectionData.conversionRate * 10}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-primary-navy rounded-full"
              />
            </div>
          </div>

          {/* Units Sold */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Units Sold</span>
            <span className="text-2xl font-bold text-text-primary">
              {topCollectionData.unitsSold}
            </span>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center gap-2 text-sm font-medium text-primary-navy hover:text-primary-navy/80 transition-colors mt-4"
        >
          View Analytics
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
