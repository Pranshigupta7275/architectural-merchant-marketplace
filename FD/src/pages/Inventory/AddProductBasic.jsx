import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ChevronRight, Package } from "lucide-react";
import { saveBasicInfo } from "../../features/productDraft/productDraftSlice"; 

// 1. Strict Validation matching MongoDB Schema for Step 1
const basicInfoSchema = yup.object().shape({
  title: yup.string().trim().required("Product title is required"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .typeError("Price must be a valid number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
});

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export default function AddProductBasic() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 2. Hydrate form if user navigates "back" from Step 2
  const draftBasic = useSelector((state) => state.productDraft.basic);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: {
      title: draftBasic?.title || "",
      category: draftBasic?.category || "",
      price: draftBasic?.price || "",
    },
  });

  const onSubmit = (data) => {
    // 3. Save to Redux, do NOT call createProduct API yet
    dispatch(saveBasicInfo(data));
    navigate("/admin/add-product/media");
  };

  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-sm text-slate-400 mb-2 font-medium flex items-center gap-2">
        <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/inventory")}>
          Inventory
        </span>
        <ChevronRight size={14} />
        <span className="text-slate-900">Add New Product</span>
      </div>
      <h2 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
        Basic Information
      </h2>

      {/* Progress Wizard */}
      <div className="flex items-center mb-12">
        <div className="flex items-center text-slate-900 font-semibold text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs mr-2">1</div>
          General
        </div>
        <div className="flex-1 border-t border-slate-200 mx-4"></div>
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs mr-2">2</div>
          Media
        </div>
        <div className="flex-1 border-t border-slate-200 mx-4"></div>
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs mr-2">3</div>
          Logistics
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
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-medium outline-none transition-all"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
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
                <option value="">Select category...</option>
                <option value="Assets">Assets</option>
                <option value="Fine Art">Fine Art</option>
                <option value="Industrial">Industrial</option>
                <option value="Brands">Brands</option>
                <option value="Collection">Collection</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                PRICE
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-medium">₹</span>
                <input
                  {...register("price")}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-8 pr-3 text-slate-900 font-bold outline-none"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10 pt-6 border-t border-slate-200">
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
