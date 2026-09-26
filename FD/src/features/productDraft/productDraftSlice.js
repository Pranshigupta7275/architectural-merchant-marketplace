import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basic: {
    title: "",
    price: "",
    category: "",
  },
  media: {
    images: [], 
    editorialNarrative: "",
  },
  logistics: {
    sku: "",
    stockQuantity: "",
    lowStockAlert: 5,
    displayStockCount: false,
  },
  shipping: {}
};

const productDraftSlice = createSlice({
  name: 'productDraft',
  initialState,
  reducers: {
    saveBasicInfo: (state, action) => {
      state.basic = { ...state.basic, ...action.payload };
    },
    saveMediaInfo: (state, action) => {
      state.media = { ...state.media, ...action.payload };
    },
    saveLogisticsInfo: (state, action) => {
      state.logistics = { ...state.logistics, ...action.payload };
    },
    clearDraft: () => initialState,
  },
});

export const { saveBasicInfo, saveMediaInfo, saveLogisticsInfo, clearDraft } = productDraftSlice.actions;
export default productDraftSlice.reducer;
