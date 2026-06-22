import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Badge from "../ui/Badge";
import { ordersData } from "../../data/mockData";

const statusVariants = {
  SHIPPED: "success",
  DELIVERED: "successDark",
  PROCESSING: "processing",
};

export default function OrdersTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-3xl p-7 border border-border-card shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Recent Orders
        </h3>
        <motion.a
          whileHover={{ x: 4 }}
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-primary-navy hover:text-primary-navy/80 transition-colors"
        >
          View All Orders
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Order & Product
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {order.product}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{order.id}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-muted">{order.date}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-primary">
                    {order.customer}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={statusVariants[order.status]}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-semibold text-text-primary">
                    {order.total}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
