import { useState } from "react";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut, 
  Plus 
} from "lucide-react";

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  // Mock User Data (Replace with your Redux user state later)
  const user = {
    name: "Premium Furniture Co",
    email: "merchant@furniture.com",
    initials: "PF"
  };

  const tabs = [
    { id: "orders", label: "Order History", icon: Package },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-[#111827] text-white flex items-center justify-center text-2xl font-bold tracking-widest rounded-full shadow-md">
          {user.initials}
        </div>
        <div>
          <p className="text-[12px] text-gray-500 font-bold uppercase tracking-widest mb-1">
            Welcome Back
          </p>
          <h1 className="text-3xl font-bold text-[#111827]">{user.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer rounded-sm ${
                    isActive
                      ? "bg-gray-100 text-[#111827] border-l-4 border-[#111827]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#111827] border-l-4 border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
            
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer rounded-sm border-l-4 border-transparent mt-4">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1">
          {/* ORDER HISTORY TAB */}
          {activeTab === "orders" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Order History</h2>
              <div className="overflow-x-auto border border-gray-100 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] uppercase tracking-widest text-gray-500">
                      <th className="p-4 font-bold">Order #</th>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#111827] divide-y divide-gray-100">
                    {/* Mock Order Row */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">#ORD-9483</td>
                      <td className="p-4 text-gray-500">Oct 24, 2026</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                          Delivered
                        </span>
                      </td>
                      <td className="p-4 font-medium">$1,249.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">#ORD-8271</td>
                      <td className="p-4 text-gray-500">Sep 12, 2026</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                          Processing
                        </span>
                      </td>
                      <td className="p-4 font-medium">$450.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SAVED ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111827]">Saved Addresses</h2>
                <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#111827] hover:text-gray-500 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 p-6 rounded-sm relative group">
                  <span className="absolute top-4 right-4 bg-[#111827] text-white text-[10px] px-2 py-1 uppercase tracking-wider rounded-sm">
                    Default
                  </span>
                  <p className="font-bold text-[#111827] mb-2">Office HQ</p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>Premium Furniture Co.</p>
                    <p>123 Design Avenue, Suite 400</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                  <div className="flex gap-4 text-[12px] font-bold tracking-widest uppercase">
                    <button className="text-[#111827] hover:text-gray-500 cursor-pointer">Edit</button>
                    <button className="text-red-500 hover:text-red-700 cursor-pointer">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT METHODS TAB */}
          {activeTab === "payments" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111827]">Payment Methods</h2>
                <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#111827] hover:text-gray-500 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Payment
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 p-6 rounded-sm flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#111827] mb-1">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Expires 12/28</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="flex gap-4 text-[12px] font-bold tracking-widest uppercase">
                    <button className="text-[#111827] hover:text-gray-500 cursor-pointer">Edit</button>
                    <button className="text-red-500 hover:text-red-700 cursor-pointer">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Account Settings</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Company / Full Name
                    </label>
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#111827] text-sm text-[#111827]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#111827] text-sm text-[#111827]"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#111827] mb-4">Password Change</h3>
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="password" 
                        placeholder="Current Password"
                        className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#111827] text-sm text-[#111827]"
                      />
                    </div>
                    <div>
                      <input 
                        type="password" 
                        placeholder="New Password"
                        className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#111827] text-sm text-[#111827]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-[#111827] text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
