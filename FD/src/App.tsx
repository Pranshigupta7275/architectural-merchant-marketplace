import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// --- LAYOUT IMPORTS ---
import DashboardLayout from "./layout/DashboardLayout";
import StorefrontLayout from "./layout/StorefrontLayout";

// --- AUTH IMPORTS ---
import CustomerLogin from "./features/auth/CustomerLogin";
import Register from "./pages/Register";

// --- STOREFRONT PAGE IMPORTS ---
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/storefront/Cart";
import Wishlist from "./pages/Wishlist";

// --- CHECKOUT & PRODUCT DETAILS ---
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import AccountDashboard from "./components/storefront/account/AccountDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";

// --- ADMIN PAGE IMPORTS ---
import Dashboard from "./pages/Dashboard/Dashboard";
import InventoryList from "./features/inventory/InventoryList";
import AddProductBasic from "./pages/Inventory/AddProductBasic";
import AddProductMedia from "./pages/Inventory/AddProductMedia";
import AddProductLogistics from "./pages/Inventory/AddProductLogistics";
import OrdersList from "./features/orders/OrdersList";
import Analytics from "./pages/Analytics";
import CustomersList from "./pages/Customers";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      {/* =========================================
          0. PUBLIC AUTHENTICATION
           ========================================= */}
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/register" element={<Register />} />

      {/* =========================================
          1. CUSTOMER STOREFRONT (Public Luxury Domain)
           ========================================= */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* Account Dashboard route */}
        <Route path="account" element={<AccountDashboard />} />

        {/* Routes required by the CartDrawer */}
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="architecture/:id" element={<ProductDetails />} />
      </Route>

      {/* =========================================
          2. MERCHANT ADMIN DASHBOARD (Protected Domain)
           ========================================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="add-product/basic" element={<AddProductBasic />} />
          <Route path="add-product/media" element={<AddProductMedia />} />
          <Route path="add-product/logistics" element={<AddProductLogistics />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<CustomersList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* =========================================
          3. CATCH-ALL FALLBACK
           ========================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
