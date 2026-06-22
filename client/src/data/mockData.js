/**
 * @file mockData.js
 * @description Centralized mock data for the Merchant Portal dashboard.
 * Structured to closely mirror expected REST API / GraphQL schema responses.
 */

// ==========================================
// 1. ANALYTICS & METRICS DATA
// ==========================================

/** @type {Array<{day: string, revenue: number}>} */
export const salesData = [
  { day: 'MON', revenue: 40 },
  { day: 'TUE', revenue: 60 },
  { day: 'WED', revenue: 35 },
  { day: 'THU', revenue: 80 },
  { day: 'FRI', revenue: 95 },
  { day: 'SAT', revenue: 75 },
  { day: 'SUN', revenue: 85 },
];

/** @type {Array<{id: number, title: string, value: string, badge?: string, badgeText?: string, subtitle?: string, type: string}>} */
export const statsData = [
  {
    id: 1,
    title: 'TOTAL SALES REVENUE',
    value: '$142,850.00',
    badge: '+12.4%',
    badgeText: 'vs last month',
    type: 'revenue',
  },
  {
    id: 2,
    title: 'ACTIVE LISTINGS',
    value: '48',
    subtitle: '6 items low on stock',
    type: 'listings',
  },
  {
    id: 3,
    title: 'CUSTOMER SATISFACTION',
    value: '4.9',
    type: 'satisfaction',
  },
];

export const topCollectionData = {
  title: 'BRUTALIST SERIES',
  activeSKUs: 12,
  conversionRate: 4.2,
  unitsSold: 184,
};


// ==========================================
// 2. E-COMMERCE ENTITIES (Orders & Customers)
// ==========================================

/** @type {Array<{id: string, product: string, date: string, customer: string, status: 'SHIPPED' | 'PROCESSING' | 'DELIVERED', total: string}>} */
export const ordersData = [
  {
    id: 'ORD-9921-X',
    product: 'Curated Print #042',
    date: 'Dec 14, 2024',
    customer: 'Marcus Thorne',
    status: 'SHIPPED',
    total: '$450.00',
  },
  {
    id: 'ORD-9918-B',
    product: 'Bauhaus Desk Lamp',
    date: 'Dec 13, 2024',
    customer: 'Elena Rossi',
    status: 'PROCESSING',
    total: '$1,200.00',
  },
  {
    id: 'ORD-9899-A',
    product: 'Structure Study #09',
    date: 'Dec 12, 2024',
    customer: 'David Chen',
    status: 'DELIVERED',
    total: '$320.00',
  },
];

/** @type {Array<{id: number, name: string, email: string, avatar: string, segment: 'VIP' | 'New' | 'Inactive', orders: number, ltv: string}>} */
export const customerData = [
  { 
    id: 1, 
    name: 'Julian Thorne', 
    email: 'j.thorne@architectural.design', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
    segment: 'VIP', 
    orders: 42, 
    ltv: '$84,200.00' 
  },
  { 
    id: 2, 
    name: 'Elena Rodriguez', 
    email: 'elena.r@curatedspaces.co', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
    segment: 'New', 
    orders: 3, 
    ltv: '$5,400.00' 
  },
  { 
    id: 3, 
    name: 'Marcus Sterling', 
    email: 'm.sterling@privateestate.io', 
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
    segment: 'VIP', 
    orders: 89, 
    ltv: '$212,500.00' 
  },
  { 
    id: 4, 
    name: 'Sienna Miller', 
    email: 'sienna@independentliving.com', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 
    segment: 'Inactive', 
    orders: 1, 
    ltv: '$850.00' 
  },
];


// ==========================================
// 3. SYSTEM & UI CONFIGURATION
// ==========================================

export const navigationItems = [
  { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { name: 'Inventory', path: '/inventory', icon: 'Package' },
  { name: 'Orders', path: '/orders', icon: 'ShoppingBag' },
  { name: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { name: 'Customers', path: '/customers', icon: 'Users' },
  { name: 'Settings', path: '/settings', icon: 'Settings' },
];

export const userProfile = {
  name: 'Julian Vane',
  role: 'Principal Curator',
  avatar: null, // Fallback to UI Avatars in components if null
};