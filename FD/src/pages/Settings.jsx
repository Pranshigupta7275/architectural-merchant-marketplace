import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Store,
  CreditCard,
  Bell,
  Shield,
  UploadCloud,
  Trash2,
  Plus,
  Building2,
  CheckCircle,
  ChevronRight,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

// Declared outside to prevent React "Cannot create components during render" errors
const ToggleSwitch = ({ isOn, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827] ${isOn ? "bg-[#111827]" : "bg-gray-300"}`}
  >
    <motion.div
      className="bg-white w-4 h-4 rounded-full shadow-sm"
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{ transform: isOn ? "translateX(20px)" : "translateX(0px)" }}
    />
  </button>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Interactive Form State
  const [toggles, setToggles] = useState({
    orderEmails: true,
    inventoryAlerts: true,
    monthlyReport: false,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock Save Function with Success Toast
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide toast after 3 seconds
    }, 800);
  };

  // Sidebar Configuration
  const navLinks = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "store", label: "Store Details", icon: Store },
    { id: "payment", label: "Billing & Payments", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
  ];

  // Animation Variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-[12px] font-bold text-gray-500 mb-6 tracking-wide">
        <span className="hover:text-[#111827] cursor-pointer transition-colors">
          Dashboard
        </span>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="hover:text-[#111827] cursor-pointer transition-colors">
          Settings
        </span>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-[#111827]">
          {navLinks.find((n) => n.id === activeTab)?.label}
        </span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">
          Platform Settings
        </h1>
        <p className="text-gray-600 text-[14px] leading-relaxed">
          Manage your store details, administrative preferences, and billing
          information.
        </p>
      </div>

      {/* Added items-start and adjusted the gap for better desktop spacing */}
<div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar pb-2 lg:pb-0 lg:sticky lg:top-28">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              const Icon = link.icon; // FIX: Capitalized component reference for strict linters

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center px-4 py-3 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap w-full text-left ${
                    isActive
                      ? "bg-white text-[#111827] shadow-sm border border-gray-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#111827] border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mr-3 stroke-[2.5] ${isActive ? "text-[#111827]" : "text-gray-400"}`}
                  />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Form Area */}
        <main className="flex-1 min-w-0 max-w-4xl">
          {/* Success Feedback Toast */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center text-emerald-800 text-[13px] font-bold"
              >
                <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
                Settings saved successfully.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* =========================================
                PROFILE TAB 
            ========================================= */}
            {activeTab === "profile" && (
              <motion.form
                key="profile"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSave}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col-reverse sm:flex-row justify-between sm:items-start mb-10 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        Personal Profile
                      </h3>
                      <p className="text-[13px] text-gray-600 mt-1">
                        Manage your merchant account details.
                      </p>
                    </div>
                    <div className="relative group cursor-pointer shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=80&h=80"
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Julian"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Thorne"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Login Email
                    </label>
                    <input
                      type="email"
                      disabled
                      defaultValue="j.thorne@architectural.co"
                      className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-[14px] rounded-lg px-4 py-2.5 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">
                      Contact support to change your primary login email.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#111827] text-white text-[13px] font-bold rounded-lg px-6 py-2.5 shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* =========================================
                STORE DETAILS TAB
            ========================================= */}
            {activeTab === "store" && (
              <motion.form
                key="store"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSave}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-8">
                  <h3 className="text-lg font-bold text-[#111827]">
                    Store Branding
                  </h3>
                  <p className="text-[13px] text-gray-600 mt-1 mb-8">
                    Configure your public storefront branding and assets.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-8 mb-10 pb-10 border-b border-gray-100">
                    <div className="w-32 shrink-0">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Store Logo
                      </label>
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-[#111827] hover:text-[#111827] transition-colors cursor-pointer group">
                        <UploadCloud className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          Upload
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Store Name
                        </label>
                        <input
                          type="text"
                          defaultValue="The Architectural Merchant"
                          className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Tagline / Short Description
                        </label>
                        <input
                          type="text"
                          defaultValue="Curating the world's finest structural elements."
                          className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#111827]">
                    Contact & Regional
                  </h3>
                  <p className="text-[13px] text-gray-600 mt-1 mb-6">
                    How customers reach you and how prices are displayed.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="flex items-center text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        <Mail className="w-3.5 h-3.5 mr-1.5" /> Support Email
                      </label>
                      <input
                        type="email"
                        defaultValue="support@architectural.co"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        <Phone className="w-3.5 h-3.5 mr-1.5" /> Contact Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        <Globe className="w-3.5 h-3.5 mr-1.5" /> Primary Website
                      </label>
                      <input
                        type="url"
                        defaultValue="https://architectural.co"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Currency
                      </label>
                      <select className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none transition-all shadow-sm appearance-none cursor-pointer">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    className="text-[13px] font-bold text-gray-600 hover:text-[#111827] transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#111827] text-white text-[13px] font-bold rounded-lg px-6 py-2.5 shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* =========================================
                PAYMENT TAB
            ========================================= */}
            {activeTab === "payment" && (
              <motion.form
                key="payment"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSave}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827]">
                        Payment Methods
                      </h3>
                      <p className="text-[13px] text-gray-500 mt-1">
                        Manage where your earnings are deposited.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[12px] font-bold text-[#111827] transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1.5" /> Add Method
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Visa Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors gap-4">
                      <div className="flex items-center">
                        <div className="w-14 h-9 bg-[#1A1F36] rounded-md text-white flex items-center justify-center text-[11px] font-bold tracking-wider mr-4 shadow-sm shrink-0">
                          VISA
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#111827]">
                            Visa ending in 4242
                          </div>
                          <div className="text-[12px] text-gray-500 mt-0.5">
                            Expires 12/26 &bull; Default
                          </div>
                        </div>
                      </div>
                      <span className="self-start sm:self-auto bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-100">
                        Verified
                      </span>
                    </div>

                    {/* Bank Account */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors gap-4">
                      <div className="flex items-center">
                        <div className="w-14 h-9 bg-gray-50 border border-gray-200 rounded-md text-[#111827] flex items-center justify-center mr-4 shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#111827]">
                            Chase Business Checking
                          </div>
                          <div className="text-[12px] text-gray-500 mt-0.5">
                            Ending in 8890
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="self-start sm:self-auto p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.form>
            )}

            {/* =========================================
                NOTIFICATIONS TAB 
            ========================================= */}
            {activeTab === "notifications" && (
              <motion.form
                key="notifications"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSave}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-8">
                  <h3 className="text-lg font-bold text-[#111827]">
                    Alerts & Notifications
                  </h3>
                  <p className="text-[13px] text-gray-600 mt-1 mb-8">
                    Manage what emails are sent to your account.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-8 border-b border-gray-100">
                      <div className="pr-8">
                        <div className="text-[14px] font-bold text-[#111827]">
                          Order Success Emails
                        </div>
                        <div className="text-[13px] text-gray-500 mt-1 leading-relaxed">
                          Receive a receipt confirmation every time a
                          transaction succeeds.
                        </div>
                      </div>
                      <ToggleSwitch
                        isOn={toggles.orderEmails}
                        onToggle={() => handleToggle("orderEmails")}
                      />
                    </div>

                    <div className="flex items-center justify-between pb-8 border-b border-gray-100">
                      <div className="pr-8">
                        <div className="text-[14px] font-bold text-[#111827]">
                          Low Inventory Alerts
                        </div>
                        <div className="text-[13px] text-gray-500 mt-1 leading-relaxed">
                          Get notified when a product SKU falls below 5 units.
                        </div>
                      </div>
                      <ToggleSwitch
                        isOn={toggles.inventoryAlerts}
                        onToggle={() => handleToggle("inventoryAlerts")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="pr-8">
                        <div className="text-[14px] font-bold text-[#111827]">
                          Monthly Insights Report
                        </div>
                        <div className="text-[13px] text-gray-500 mt-1 leading-relaxed">
                          A detailed PDF report summarizing sales and traffic
                          data.
                        </div>
                      </div>
                      <ToggleSwitch
                        isOn={toggles.monthlyReport}
                        onToggle={() => handleToggle("monthlyReport")}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#111827] text-white text-[13px] font-bold rounded-lg px-6 py-2.5 shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* =========================================
                SECURITY TAB 
            ========================================= */}
            {activeTab === "security" && (
              <motion.form
                key="security"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSave}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-8">
                  <h3 className="text-lg font-bold text-[#111827]">
                    Security & Access
                  </h3>
                  <p className="text-[13px] text-gray-600 mt-1 mb-8">
                    Update your password and secure your account.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full bg-white border border-gray-300 text-[#111827] text-[14px] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111827] outline-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#111827] text-white text-[13px] font-bold rounded-lg px-6 py-2.5 shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-70"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
