import  { Fragment } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Wallet,
} from "lucide-react";
import Card from "../../components/ui/Card";

export default function OrdersList() {
  // MOCK DATA: Aligned with the premium reference design
  const metrics = {
    totalOrders: "1,284",
    pending: "42",
    avgValue: "$8,940.00",
  };

  const orders = [
    {
      id: "#ORD-2024-001",
      customer: "Julianne DeForest",
      email: "j.deforest@studio-arc.com",
      initials: "JD",
      color: "bg-indigo-50 text-indigo-700",
      date: "Oct 24, 2024",
      status: "SHIPPED",
      total: 12450.0,
    },
    {
      id: "#ORD-2024-002",
      customer: "Marcus Bennett",
      email: "marcus@urbanbuild.io",
      initials: "MB",
      color: "bg-blue-50 text-blue-700",
      date: "Oct 23, 2024",
      status: "PROCESSING",
      total: 3120.5,
    },
    {
      id: "#ORD-2024-003",
      customer: "Elena Langford",
      email: "e.langford@vista-designs.com",
      initials: "EL",
      color: "bg-gray-100 text-gray-700",
      date: "Oct 22, 2024",
      status: "DELIVERED",
      total: 24900.0,
    },
    {
      id: "#ORD-2024-004",
      customer: "Samuel Halloway",
      email: "samuel@halloway.ltd",
      initials: "SH",
      color: "bg-orange-50 text-orange-700",
      date: "Oct 21, 2024",
      status: "CANCELLED",
      total: 850.0,
    },
    {
      id: "#ORD-2024-005",
      customer: "Aria Khalid",
      email: "aria@khalid-partners.net",
      initials: "AK",
      color: "bg-emerald-50 text-emerald-700",
      date: "Oct 20, 2024",
      status: "PROCESSING",
      total: 5430.75,
    },
  ];

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "SHIPPED":
      case "DELIVERED":
        return (
          <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {status}
          </span>
        );
      case "PROCESSING":
        return (
          <span className="bg-[#E2E8F0] text-[#475569] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {status}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">
            Order Management
          </h1>
          <p className="text-gray-500 text-[14px] leading-relaxed">
            Overview of procurement activities and fulfillment status for the Q4
            Architectural cycle.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2.5 bg-[#F3F4F6] text-[#111827] text-[13px] font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2.5 bg-[#111827] text-white text-[13px] font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" /> New Order
          </motion.button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center p-6 border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mr-5">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-500 mb-1">
              Total Orders
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {metrics.totalOrders}
            </div>
          </div>
        </Card>

        <Card className="flex items-center p-6 border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-5">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-500 mb-1">
              Pending Fulfillment
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {metrics.pending}
            </div>
          </div>
        </Card>

        <Card className="flex items-center p-6 border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mr-5">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-500 mb-1">
              Average Order Value
            </div>
            <div className="text-2xl font-bold text-[#111827]">
              {metrics.avgValue}
            </div>
          </div>
        </Card>
      </div>

      {/* Main DataTable */}
      <Card noPadding className="border-gray-100 shadow-sm">
        {/* Table Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-1.5 border border-gray-200 text-[#111827] text-[12px] font-semibold rounded-md hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filter
            </button>
            <span className="text-[13px] text-gray-500 font-medium">
              Showing 1-10 of 1,284 orders
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-gray-400 hover:text-[#111827] hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-[#111827] hover:bg-gray-100 rounded transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-500 tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-100"
            >
              {orders.map((order, index) => (
                <motion.tr
                  variants={rowVariants}
                  key={index}
                  className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="font-bold text-[#111827] text-[13px] tracking-wide">
                      {order.id.split("-").map((part, i) => (
                        <Fragment key={i}>
                          {part}
                          {i < 2 ? "-" : ""}
                          {i < 2 && <br />}
                        </Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold ${order.color}`}
                    >
                      {order.initials}
                    </div>
                    <div>
                      <div className="font-bold text-[#111827] text-[13.5px] mb-0.5">
                        {order.customer}
                      </div>
                      <div className="text-gray-500 text-[12px]">
                        {order.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#111827] font-medium text-[13px]">
                    {order.date}
                  </td>
                  <td className="px-6 py-5">
                    {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-[#111827] text-[14px]">
                    $
                    {order.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white text-[12px] font-medium text-gray-500">
          <div>Last updated: 2 minutes ago</div>
          <div className="flex items-center space-x-4">
            <span className="text-[#111827] font-bold cursor-pointer">1</span>
            <span className="hover:text-[#111827] cursor-pointer transition-colors">
              2
            </span>
            <span className="hover:text-[#111827] cursor-pointer transition-colors">
              3
            </span>
            <span>...</span>
            <span className="hover:text-[#111827] cursor-pointer transition-colors">
              12
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
