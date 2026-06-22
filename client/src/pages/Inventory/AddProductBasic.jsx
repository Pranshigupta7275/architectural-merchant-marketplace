import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ChevronRight, Package, BarChart2 } from "lucide-react";

const basicInfoSchema = yup.object().shape({
  title: yup.string().required("Product title is required"),
  category: yup.string().required("Category is required"),
  sellingPrice: yup.number().positive().required("Selling price is required"),
  originalPrice: yup.number().positive(),
});

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export default function AddProductBasic() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: {
      title: "Men Cotton T-Shirt Black XL",
      category: "Clothing",
      sellingPrice: 45.0,
      originalPrice: 60.0,
    },
  });

  const onSubmit = () => {
    toast.success("Basic information saved!");
    navigate("/add-product/logistics");
  };

  return (
    <motion.div {...pageTransition} key="add-basic">
      <div className="text-sm text-slate-400 mb-2 font-medium flex items-center gap-2">
        <span
          className="text-blue-400 cursor-pointer"
          onClick={() => navigate("/inventory")}
        >
          Inventory
        </span>
        <ChevronRight size={14} />
        <span className="text-slate-900">Add New Product</span>
      </div>
      <h2 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
        Basic Information
      </h2>

      <div className="flex items-center mb-12 max-w-3xl">
        <div className="flex items-center text-slate-900 font-semibold text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs mr-2">
            1
          </div>
          General
        </div>
        <div className="flex-1 border-t border-slate-200 mx-4"></div>
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs mr-2">
            2
          </div>
          Media
        </div>
        <div className="flex-1 border-t border-slate-200 mx-4"></div>
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs mr-2">
            3
          </div>
          Inventory
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-semibold">
            <Package size={20} /> Product Identity
          </div>
          <div className="mb-6">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              PRODUCT TITLE
            </label>
            <input
              {...register("title")}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-2 italic">
              Use a clear, descriptive title for better search results.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                CATEGORY
              </label>
              <select
                {...register("category")}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-medium outline-none"
              >
                <option value="Clothing">Clothing</option>
                <option value="Hardware">Architectural Hardware</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                SUB-CATEGORY
              </label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-medium outline-none">
                <option>Activewear</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-semibold">
              <BarChart2 size={20} /> Pricing & Revenue
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  SELLING PRICE
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    {...register("sellingPrice")}
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-8 pr-3 text-slate-900 font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ORIGINAL PRICE (MSRP)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    {...register("originalPrice")}
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-8 pr-3 text-slate-500 font-medium outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 bg-slate-800 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center">
            <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-2">
              CALCULATED DISCOUNT
            </label>
            <div className="text-5xl font-bold mb-1 tracking-tight">
              25<span className="text-2xl">%</span>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-6">
              AUTOMATIC BADGE APPLIED
            </div>
            <div className="flex items-center text-sm text-blue-200 bg-slate-900/50 py-2 px-3 rounded-lg w-max border border-slate-700">
              <BarChart2 size={14} className="mr-2" /> Margin: 35% ($15.75)
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
          <button
            type="button"
            className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-800"
          >
            SAVE DRAFT
          </button>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 px-6 rounded-lg uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            NEXT: MEDIA ASSETS <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
