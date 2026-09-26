import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { saveMediaInfo } from "../../features/productDraft/productDraftSlice"; 

export default function AddProductMedia() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Pull existing draft data if the user goes "back" from Step 3
  const draftMedia = useSelector((state) => state.productDraft.media);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      editorialNarrative: draftMedia?.editorialNarrative || "",
    },
  });

  const onSubmit = (data) => {
    // Save to Redux Draft
    dispatch(saveMediaInfo(data));
    // Move to the final Logistics step!
    navigate("/admin/add-product/logistics");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-sm text-slate-400 mb-2 font-medium flex items-center gap-2">
        <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/admin/inventory")}>
          Inventory
        </span>
        <ChevronRight size={14} />
        <span className="text-slate-900">Add New Product</span>
      </div>
      
      <h2 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
        Media & Narrative
      </h2>

      {/* Progress Wizard */}
      <div className="flex items-center mb-12">
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs mr-2">1</div>
          General
        </div>
        <div className="flex-1 border-t border-slate-200 mx-4"></div>
        <div className="flex items-center text-slate-900 font-semibold text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs mr-2">2</div>
          Media
        </div>
        <div className="flex-1 border-t border-slate-200 mx-4"></div>
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs mr-2">3</div>
          Logistics
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-semibold">
            <ImageIcon size={20} /> Product Story
          </div>
          
          <div className="mb-6">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              EDITORIAL NARRATIVE (DESCRIPTION)
            </label>
            <textarea
              {...register("editorialNarrative")}
              rows="5"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              placeholder="Describe the architectural significance, materials, and origin of this piece..."
            ></textarea>
          </div>
          
          <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
            <strong>Note:</strong> Image uploads are securely handled on the final Logistics & Publish screen to ensure direct delivery to the database.
          </div>
        </div>

        <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/admin/add-product/basic")}
            className="text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2"
          >
            <ChevronLeft size={16} /> BACK: GENERAL
          </button>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 px-6 rounded-lg uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            NEXT: LOGISTICS <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
