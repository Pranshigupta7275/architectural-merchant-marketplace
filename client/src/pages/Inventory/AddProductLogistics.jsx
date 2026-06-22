import { motion } from "framer-motion";
import { ChevronRight, UploadCloud, Package, Bell } from "lucide-react";

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export default function AddProductLogistics() {
  return (
    <motion.div {...pageTransition} key="add-logistics">
      <div className="text-sm text-slate-400 mb-2 font-medium flex items-center gap-2 uppercase tracking-wide text-[10px]">
        PRODUCTS <ChevronRight size={12} /> NEW LISTING{" "}
        <ChevronRight size={12} /> STEP 03
      </div>

      <div className="flex justify-between items-start mb-10">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Logistics & Fulfilment
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Finalize your product listing by configuring real-time stock
            monitoring and precise shipping dimensions for the Digital Curator
            network.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="border border-slate-200 bg-white text-slate-700 font-semibold py-2 px-6 rounded-lg text-sm shadow-sm hover:bg-slate-50">
            Save Draft
          </button>
          <button className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold py-2 px-6 rounded-lg text-sm shadow-sm flex items-center gap-2">
            Save & Publish <UploadCloud size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Inventory & Stock Management
                </h3>
                <p className="text-xs text-slate-500">
                  Configure SKU tracking and stock safety nets.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                STOCK KEEPING UNIT (SKU)
              </label>
              <input
                type="text"
                value="ARCH-MRCH-2024-001"
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-600 font-medium outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  STOCK QUANTITY
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 font-bold outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">
                    Units
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  LOW STOCK ALERT
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full border border-red-200 rounded-lg p-3 text-slate-900 font-bold outline-none bg-red-50/30"
                  />
                  <Bell
                    size={16}
                    className="absolute right-4 top-3.5 text-red-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Notify me when stock falls below this level.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  Display stock count to customers
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Encourage urgency by showing remaining quantity on the
                  storefront.
                </div>
              </div>
              <div className="w-12 h-6 bg-slate-900 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
              LISTING PREVIEW
            </div>
            <div className="bg-slate-100 rounded-xl h-40 mb-4 relative overflow-hidden flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-teal-800 shadow-xl"></div>
              <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[9px] font-bold px-2 py-1 rounded uppercase">
                ACTIVE
              </span>
            </div>
            <h4 className="font-bold text-slate-900">
              Nordic Minimalist Lounge Chair
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Handcrafted architectural furniture designed for modern executive
              spaces...
            </p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg text-white">
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-4">
              SHIPPING ESTIMATES
            </div>
            <div className="text-2xl font-bold mb-3 tracking-tight text-white">
              $42.00 — $85.00
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Based on current weight and dimensions. These values will be used
              to calculate live courier rates at checkout.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
