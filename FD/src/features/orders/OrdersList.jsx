import { Fragment } from "react";
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
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Card from "../../components/ui/Card";
import { useGetOrdersQuery } from "../../services/ordersApiSlice";

const renderStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return (
        <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          Delivered
        </span>
      );
    case "Processing":
      return (
        <span className="bg-[#E2E8F0] text-[#475569] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          Processing
        </span>
      );
    case "Shipped":
      return (
        <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          Shipped
        </span>
      );
    case "Cancelled":
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          {status}
        </span>
      );
  }
};

const OrderRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-5">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
    </td>
    <td className="px-6 py-5">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-5">
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-5 text-right">
      <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
    </td>
  </tr>
);

export default function OrdersList() {
  const { data: ordersResponse, isLoading, isError, error, refetch } = useGetOrdersQuery();
  const orders = ordersResponse?.data || ordersResponse?.orders || [];

  const metrics = {
    totalOrders: orders.length || "—",
    pending: orders.filter((o) => o.status === "Pending" || o.status === "Processing").length || "—",
    avgValue:
      orders.length > 0
        ? `$${(orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) / orders.length).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : "—",
  };

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
            Overview of procurement activities and fulfillment status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center px-4 py-2.5 bg-[#F3F4F6] text-[#111827] text-[13px] font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </motion.button>
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : metrics.totalOrders}
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : metrics.pending}
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
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : metrics.avgValue}
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
              {isLoading ? 'Loading...' : `Showing 1-${orders.length} of ${orders.length} orders`}
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
              {isLoading ? (
                [...Array(5)].map((_, i) => <OrderRowSkeleton key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-red-600">
                      <AlertCircle className="w-8 h-8 mb-3" />
                      <p className="font-bold mb-2">Failed to load orders</p>
                      <p className="text-sm text-gray-500 mb-4">{error?.data?.message || 'An unexpected error occurred.'}</p>
                      <button
                        onClick={() => refetch()}
                        className="flex items-center px-4 py-2 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No orders yet. Orders will appear here once customers make purchases.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr
                    variants={rowVariants}
                    key={order._id || index}
                    className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-[#111827] text-[13px] tracking-wide">
                        #{String(order._id || order.id).slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-5 flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-600">
                        {(order.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#111827] text-[13.5px] mb-0.5">
                          {order.user?.name || 'Unknown Customer'}
                        </div>
                        <div className="text-gray-500 text-[12px]">
                          {order.user?.email || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#111827] font-medium text-[13px]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-5">
                      {renderStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-[#111827] text-[14px]">
                      ${(order.totalPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!isLoading && !isError && orders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white text-[12px] font-medium text-gray-500">
            <div>Last updated: just now</div>
            <div className="flex items-center space-x-4">
              <span className="text-[#111827] font-bold cursor-pointer">1</span>
              <span className="hover:text-[#111827] cursor-pointer transition-colors">
                {Math.ceil(orders.length / 10) || 1}
              </span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
