// src/modules/customers/customer.model.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    // Optional: Link this profile to your main authentication User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, 
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/64?text=User',
    },
    segment: {
      type: String,
      enum: ['VIP', 'New', 'Inactive', 'Regular'],
      default: 'New',
    },
    orders: {
      type: Number,
      default: 0,
    },
    ltv: {
      type: Number,
      default: 0.00,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;