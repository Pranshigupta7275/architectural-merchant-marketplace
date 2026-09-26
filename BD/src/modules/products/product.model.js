import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // --- RELATIONSHIP ---
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    // --- STEP 01: BASIC DETAILS ---
    title: { 
      type: String, 
      required: [true, 'Please add a product title'],
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
      default: 0 
    },
    
    // 🔥 FIX 1: MOVED TO TOP LEVEL & ENUMS UPDATED TO MATCH NAVBAR
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Assets', 'Fine Art', 'Industrial', 'Brands', 'Collection'], 
      default: 'Collection'
    },
    
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
    },

    // 🔥 FIX 2: MOVED REVIEWS TO TOP LEVEL
    averageRating: {
      type: Number,
      min: [0, 'Rating cannot be negative'], 
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    numOfReviews: {
      type: Number,
      default: 0
    },

    // --- STEP 02: MEDIA & DETAILS ---
    images: [
      {
        url: { type: String, required: true, trim: true },
        isMain: { type: Boolean, default: false },
      },
    ],
    editorialNarrative: {
      type: String, 
    },
    technicalSpecs: {
      primaryMaterial: { type: String, trim: true },
      finish: { type: String, trim: true },
      dimensions: {
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
        depth: { type: Number, min: 0 },
      },
      weightCapacity: { type: Number, min: 0 },
      availablePalettes: [{ type: String, trim: true }], 
    },

    // --- STEP 03: LOGISTICS & FULFILLMENT ---
    inventory: {
      sku: { 
        type: String, 
        required: [true, 'Please add a SKU'], 
        unique: true,
        trim: true,
        uppercase: true 
      },
      stockQuantity: { 
        type: Number, 
        required: [true, 'Please add stock quantity'], 
        min: [0, 'Stock cannot be negative'],
        default: 0 
      },
      lowStockAlert: { type: Number, min: 0, default: 5 },
      displayStockCount: { type: Boolean, default: false },
    },
    
    shipping: {
      itemWeight: { type: Number, min: 0 },
      packageDimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
      },
      shippingClass: {
        type: String,
        enum: ['Standard', 'Fragile', 'Heavy/Bulky', 'Express Only'],
        default: 'Standard',
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  title: 'text',
  category: 'text',
  'inventory.sku': 'text',
});

const Product = mongoose.model('Product', productSchema);
export default Product;