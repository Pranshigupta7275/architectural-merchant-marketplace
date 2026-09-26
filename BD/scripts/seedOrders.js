import dns from 'node:dns';

dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
  '1.1.1.1',
  '1.0.0.1',
]);
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all your models
import User from '../src/modules/users/user.model.js';
import Product from '../src/modules/products/product.model.js';
import Order from '../src/modules/orders/order.model.js';
import Customer from '../src/modules/customers/customer.model.js';

// Load environment variables so we can connect to MongoDB
dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Seeding...');

    // 2. Clear existing database collections to prevent duplicates
    await Order.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Old Data Destroyed!');

    // ==========================================
    // 3. SEED USERS (Triggers the bcrypt pre-save hook)
    // ==========================================
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@architectural.com',
      password: 'password123',
      role: 'admin'
    });

    const merchantUser = await User.create({
      name: 'Premium Furniture Co',
      email: 'merchant@furniture.com',
      password: 'password123',
      role: 'merchant'
    });

    const customerUser = await User.create({
      name: 'Julian Thorne',
      email: 'j.thorne@architectural.design',
      password: 'password123',
      role: 'customer'
    });
    console.log('👤 Users Created!');

    // ==========================================
    // 4. SEED CUSTOMER PROFILE
    // ==========================================
    await Customer.create({
      user: customerUser._id, // Links to the Auth User
      name: customerUser.name,
      email: customerUser.email,
      segment: 'VIP',
      orders: 1,
      ltv: 899.99
    });
    console.log('📊 Customer Profile Created!');

    // ==========================================
    // 5. SEED PRODUCTS
    // ==========================================
    const products = await Product.create([
      {
        merchantId: merchantUser._id,
        title: 'Mid-Century Modern Leather Sofa',
        category: 'Assets', // 🔥 Changed to capital 'Assets'
        price: 899.99,
        status: 'ACTIVE',
        images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', isMain: true }],
        technicalSpecs: { primaryMaterial: 'Leather', finish: 'Matte' },
        inventory: { sku: 'SOFA-MOD-01', stockQuantity: 15 },
        shipping: { shippingClass: 'Heavy/Bulky' }
      },
      {
        merchantId: merchantUser._id,
        title: 'Solid Oak Dining Table',
        category: 'Industrial', // 🔥 Changed to capital 'Industrial'
        price: 1250.00,
        status: 'ACTIVE',
        images: [{ url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7', isMain: true }],
        technicalSpecs: { primaryMaterial: 'Wood', finish: 'Natural Oak' },
        inventory: { sku: 'TABLE-OAK-02', stockQuantity: 5 },
        shipping: { shippingClass: 'Heavy/Bulky' }
      },
      {
        merchantId: merchantUser._id,
        title: 'Calacatta Gold Italian Marble Slab',
        category: 'Collection', // 🔥 Changed from 'architectural' to 'Collection' to match your schema
        price: 3200.00,
        status: 'ACTIVE',
        images: [{ url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705', isMain: true }],
        technicalSpecs: { primaryMaterial: 'Marble', finish: 'Polished' },
        inventory: { sku: 'ARC-MAR-001', stockQuantity: 15 },
        shipping: { shippingClass: 'Heavy/Bulky' }
      }
    ]);
    console.log('🛋️  Products Created!');

    // ==========================================
    // 6. SEED ORDERS
    // ==========================================
    // Create an order where Julian buys the Leather Sofa from the Merchant
    await Order.create({
      user: customerUser._id,
      merchantId: merchantUser._id,
      orderItems: [
        {
          name: products[0].title,
          quantity: 1,
          image: products[0].images[0].url,
          price: products[0].price,
          product: products[0]._id
        }
      ],
      shippingAddress: {
        address: '123 Luxury Lane',
        city: 'Design District',
        postalCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'Stripe',
      totalPrice: products[0].price,
      status: 'Delivered',
      isPaid: true,
      paidAt: new Date()
    });
    console.log('📦 Orders Created!');

    console.log('✅ Database successfully seeded!');
    process.exit(); // Kill the script gracefully
  } catch (error) {
    console.error(`❌ Error Seeding Database: ${error.message}`);
    process.exit(1); // Kill with failure code
  }
};

// Execute the function
seedDatabase();