import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // --- RELATIONSHIP ---
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links this product to the merchant who created it
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
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
    },

    // --- STEP 02: MEDIA & DETAILS ---
    images: [
      {
        url: { 
          type: String, 
          required: true,
          trim: true
        },
        isMain: { 
          type: Boolean, 
          default: false 
        },
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
        depth: { type: Number, min: 0 }, // Stored in CM
      },
      weightCapacity: { type: Number, min: 0 }, // Stored in KG
      availablePalettes: [{ type: String, trim: true }], 
    },

    // --- STEP 03: LOGISTICS & FULFILLMENT ---
    inventory: {
      sku: { 
        type: String, 
        required: [true, 'Please add a SKU'], 
        unique: true,
        trim: true,
        uppercase: true // Enforces clean, standard SKU formatting
      },
      stockQuantity: { 
        type: Number, 
        required: [true, 'Please add stock quantity'], 
        min: [0, 'Stock cannot be negative'],
        default: 0 
      },
      lowStockAlert: { 
        type: Number, 
        min: 0,
        default: 5 
      },
      displayStockCount: { 
        type: Boolean, 
        default: false 
      },
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

const Product = mongoose.model('Product', productSchema);
export default Product;