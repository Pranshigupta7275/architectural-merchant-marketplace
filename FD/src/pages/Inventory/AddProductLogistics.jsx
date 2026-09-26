import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ChevronRight, UploadCloud, Package, Bell, Image as ImageIcon, ChevronLeft } from "lucide-react";

// RTK & Redux
import { clearDraft } from "../../features/productDraft/productDraftSlice";

import { useCreateProductMutation } from "../../services/productsApiSlice";

const logisticsSchema = yup.object().shape({
  sku: yup.string().trim().required("SKU is required"),
  stockQuantity: yup
    .number()
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .required("Stock is required"),
  lowStockAlert: yup.number().min(0).default(5),
});

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export default function AddProductLogistics() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 1. Pull the data we saved from Step 1 and Step 2
  const draftBasic = useSelector((state) => state.productDraft.basic);
  const draftMedia = useSelector((state) => state.productDraft.media);

  // 2. Local State for Image File & Toggle
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [displayStockCount, setDisplayStockCount] = useState(false);

  // 3. RTK Query Hook
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(logisticsSchema),
    defaultValues: {
      sku: "",
      stockQuantity: 0,
      lowStockAlert: 5,
    },
  });

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  
  const onSubmit = async (data) => {
    // Check if Redux state was lost due to a page refresh
    if (!draftBasic || !draftBasic.title) {
      alert("Basic product details are missing! Redirecting to Step 1.");
      navigate("/admin/add-product/basic");
      return;
    }

    if (!imageFile) {
      alert("Please upload a product image before publishing.");
      return;
    }

    try {
      const formData = new FormData();
      
      // 1. Append all basic and status data
      formData.append("title", draftBasic.title);
      formData.append("price", draftBasic.price);
      formData.append("category", draftBasic.category);
      formData.append("status", "ACTIVE");
      
      // 2. Append optional media data
      if (draftMedia?.editorialNarrative) {
        formData.append("editorialNarrative", draftMedia.editorialNarrative);
      }

      // 3. Append inventory and images
      const inventoryObj = {
        sku: data.sku,
        stockQuantity: Number(data.stockQuantity),
        lowStockAlert: Number(data.lowStockAlert),
        displayStockCount: displayStockCount,
      };
      formData.append("inventory", JSON.stringify(inventoryObj));
      formData.append("images", imageFile); 

      // 4. FIRE TO MONGODB (Only once, at the very end!)
      await createProduct(formData).unwrap();
      
      alert("Product successfully published!");
      dispatch(clearDraft());
      navigate("/admin/inventory");

    } catch (error) {
      console.error("Failed to create product:", error);
      alert(error?.data?.message || "Failed to create product");
    }
  };

  return (
    <motion.div {...pageTransition} key="add-logistics" className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-sm text-slate-400 mb-2 font-medium flex items-center gap-2 uppercase tracking-wide text-[10px]">
        PRODUCTS <ChevronRight size={12} /> NEW LISTING <ChevronRight size={12} /> STEP 03
      </div>

      {/* Wrap everything in the Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-start mb-10">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              Logistics & Fulfilment
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Finalize your product listing by configuring real-time stock monitoring and secure image uploads.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate("/admin/add-product/media")}
              className="border border-slate-200 bg-white text-slate-700 font-semibold py-2 px-6 rounded-lg text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className={`bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold py-2 px-6 rounded-lg text-sm shadow-sm flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "PUBLISHING..." : "Save & Publish"} <UploadCloud size={16} />
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
                  <h3 className="font-bold text-slate-900">Inventory & Stock Management</h3>
                  <p className="text-xs text-slate-500">Configure SKU tracking and stock safety nets.</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  STOCK KEEPING UNIT (SKU)
                </label>
                <input
                  {...register("sku")}
                  type="text"
                  placeholder="e.g. ARCH-CHAIR-001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 font-medium outline-none uppercase"
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    STOCK QUANTITY
                  </label>
                  <div className="relative">
                    <input
                      {...register("stockQuantity")}
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 font-bold outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">Units</span>
                  </div>
                  {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity.message}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    LOW STOCK ALERT
                  </label>
                  <div className="relative">
                    <input
                      {...register("lowStockAlert")}
                      type="number"
                      className="w-full border border-red-200 rounded-lg p-3 text-slate-900 font-bold outline-none bg-red-50/30"
                    />
                    <Bell size={16} className="absolute right-4 top-3.5 text-red-400" />
                  </div>
                </div>
              </div>

              {/* Functional Toggle Switch */}
              <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Display stock count to customers</div>
                  <div className="text-xs text-slate-500 mt-0.5">Encourage urgency by showing remaining quantity.</div>
                </div>
                <div 
                  onClick={() => setDisplayStockCount(!displayStockCount)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${displayStockCount ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${displayStockCount ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            {/* Image Upload Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ImageIcon size={14} /> PRODUCT IMAGE
              </div>
              
              <label className="block bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-48 mb-4 relative overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 font-medium">Click to upload image</span>
                  </>
                )}
              </label>
              
              <h4 className="font-bold text-slate-900 line-clamp-1">
                {draftBasic?.title || "Product Title Preview"}
              </h4>
              <p className="text-xs font-bold text-emerald-600 mt-1">
                ₹{draftBasic?.price || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
