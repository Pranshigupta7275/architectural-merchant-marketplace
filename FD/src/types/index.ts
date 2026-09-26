export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'merchant' | 'admin';
}

export interface Product {
  _id: string;
  merchantId: string | User;
  title: string;
  price: number;
  category: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  images: { url: string; isMain: boolean }[];
  averageRating: number;
  numOfReviews: number;
  technicalSpecs?: {
    primaryMaterial?: string;
    finish?: string;
    dimensions?: { width: number; height: number; depth: number };
    weightCapacity?: number;
    availablePalettes?: string[];
  };
  inventory?: {
    sku: string;
    stockQuantity: number;
    lowStockAlert: number;
    displayStockCount: boolean;
  };
  shipping?: {
    itemWeight?: number;
    packageDimensions?: { length: number; width: number; height: number };
    shippingClass?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  _id?: string;
  title?: string;
  name?: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
  images?: { url: string }[];
  cartQuantity?: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  image?: string;
  price: number;
  product: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string | User;
  merchantId: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  isPaid: boolean;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: string | User;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  activeListings: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  recentTransactions: Order[];
}
