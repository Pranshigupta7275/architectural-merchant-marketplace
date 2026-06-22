import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Users,
  Banknote,
  Award,
  MoreHorizontal,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { useGetCustomersQuery } from "../features/api/customerApi";

// Safely commented out until you confirm the exact file location
// import CustomerDrawer from "./Dashboard/CustomerDrawer";

const TABS = ["All Customers", "VIP Segments", "New Arrivals", "Inactive"];

export default function Customers() {
  const [activeTab, setActiveTab] = useState("All Customers");
  const [visibleCount, setVisibleCount] = useState(4);
  // Fixed: properly defined selectedCustomer to prevent eslint errors
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 1. FIRE THE NETWORK REQUEST
  const { data: customers = [], isLoading, isError } = useGetCustomersQuery();

  // 2. APPLY YOUR FILTERING LOGIC TO THE LIVE DATA
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      if (activeTab === "All Customers") return true;
      if (activeTab === "VIP Segments") return customer.segment === "VIP";
      if (activeTab === "New Arrivals") return customer.segment === "New";
      if (activeTab === "Inactive") return customer.segment === "Inactive";
      return true;
    });
  }, [activeTab, customers]);

  // Pagination logic
  const visibleCustomers = filteredCustomers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCustomers.length;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(4);
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
  };

  const renderSegmentBadge = (segment) => {
    switch (segment) {
      case "VIP":
        return (
          <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            VIP
          </span>
        );
      case "New":
        return (
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            NEW
          </span>
        );
      case "Inactive":
        return (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            INACTIVE
          </span>
        );
      default:
        return null;
    }
  };

  // 3. HANDLE LOADING STATE GRACEFULLY
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 text-[#0E4D34] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">
          Loading curator portfolio...
        </p>
      </div>
    );
  }

  // 4. HANDLE ERROR STATE
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-500 font-bold">
        Failed to load customer data. Please try again.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">
            Customer Portfolio
          </h1>
          <p className="text-gray-500 text-[14px] leading-relaxed">
            Manage your curator relationships and track lifetime engagement
            across your architectural collection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-[#111827] text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-5 py-2.5 bg-[#111827] text-white text-[13px] font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            Add New Customer
          </motion.button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="bg-[#0E4D34] text-white text-[11px] font-bold px-2 py-1 rounded">
              +12%
            </span>
          </div>
          <div className="text-[12px] font-semibold text-gray-500 mb-1">
            Total Curators
          </div>
          <div className="text-3xl font-bold text-[#111827]">
            {customers.length}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-lg">
              <Banknote className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="text-[12px] font-semibold text-gray-500 mb-1">
            Avg. Lifetime Value
          </div>
          <div className="text-3xl font-bold text-[#111827]">$14,280.00</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#0E4D34] rounded-2xl p-6 shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-[12px] font-semibold text-emerald-100 mb-1">
            VIP Retention
          </div>
          <div className="text-3xl font-bold text-white">94.2%</div>
        </motion.div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#111827] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-[#111827]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center text-[12px] font-bold text-gray-500">
          <span className="mr-2 tracking-widest uppercase">SORT BY:</span>
          <button className="flex items-center text-[#111827] hover:text-gray-600 transition-colors">
            Highest LTV <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* List Headers */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-8 text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-8 mb-2">
        <div className="col-span-5">Customer Details</div>
        <div className="col-span-2">Segment</div>
        <div className="col-span-2">Orders</div>
        <div className="col-span-2">LTV</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Customer List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {visibleCustomers.length > 0 ? (
            visibleCustomers.map((customer) => (
              <motion.div
                key={customer.id || customer._id}
                onClick={() => setSelectedCustomer(customer)}
                variants={rowVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                className="grid items-center grid-cols-1 gap-4 p-4 transition-shadow bg-white border border-gray-100 cursor-pointer md:grid-cols-12 rounded-2xl sm:px-8 sm:py-5 shadow-sm hover:shadow-md group"
              >
                {/* Customer Details */}
                <div className="flex items-center col-span-1 space-x-4 md:col-span-5">
                  <img
                    src={
                      customer.avatar ||
                      "https://via.placeholder.com/64?text=User"
                    }
                    alt={customer.name}
                    className="object-cover w-12 h-12 bg-gray-50 border border-gray-100 rounded-full"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64?text=User";
                    }}
                  />
                  <div>
                    <div className="font-bold text-[#111827] text-[14px] mb-0.5">
                      {customer.name}
                    </div>
                    <div className="text-gray-500 text-[12px]">
                      {customer.email}
                    </div>
                  </div>
                </div>

                {/* Segment Badge */}
                <div className="flex items-center col-span-1 md:col-span-2">
                  <span className="md:hidden text-[10px] uppercase font-bold text-gray-400 w-24">
                    Segment:
                  </span>
                  {renderSegmentBadge(customer.segment)}
                </div>

                {/* Orders */}
                <div className="flex items-center col-span-1 md:col-span-2">
                  <span className="md:hidden text-[10px] uppercase font-bold text-gray-400 w-24">
                    Orders:
                  </span>
                  <span className="text-[#111827] font-bold text-[14px]">
                    {customer.orders}
                  </span>
                </div>

                {/* LTV */}
                <div className="flex items-center col-span-1 md:col-span-2">
                  <span className="md:hidden text-[10px] uppercase font-bold text-gray-400 w-24">
                    LTV:
                  </span>
                  <span className="text-[#111827] font-bold text-[14px]">
                    $
                    {customer.ltv?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    }) || "0.00"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center col-span-1 mt-2 md:col-span-1 md:justify-end md:mt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="text-gray-300 hover:text-[#111827] transition-colors p-2 rounded-full hover:bg-gray-50 opacity-100 md:opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-gray-500 text-[14px]"
            >
              No customers found in this segment.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-[#111827] text-[13px] font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            Load More Curators <ChevronDown className="w-4 h-4 ml-2" />
          </motion.button>
        </motion.div>
      )}

      {/* Safely Commented Out Drawer to Prevent Crashes!
        Notice how this entire block is wrapped safely inside standard JSX comments. 
      */}
      {/* <CustomerDrawer 
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      /> 
      */}
    </motion.div>
  );
}
