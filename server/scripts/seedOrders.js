// Quick seeder script to test your UI
const Order = require('../modules/orders/order.model');
const seedData = [
  { orderId: '#ORD-2024-001', customerName: 'Julianne DeForest', email: 'j.deforest@studio-arc.com', status: 'SHIPPED', totalAmount: 12450.00 },
  { orderId: '#ORD-2024-002', customerName: 'Marcus Bennett', email: 'marcus@urbanbuild.io', status: 'PROCESSING', totalAmount: 3120.50 }
];
// Run Order.insertMany(seedData) to fill your DB