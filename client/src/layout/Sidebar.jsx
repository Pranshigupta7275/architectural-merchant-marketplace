import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  BarChart2,
  Users,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";

// CORRECT: Lowercase 'o'
// CORRECT: Lowercase 'o'
import { logout, selectCurrentUser } from "../features/auth/authSlice";
import { useLogoutMutation } from "../services/authApiSlice";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutGrid, exact: true },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Analytics", path: "/analytics", icon: BarChart2 },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Top Branding */}
        <div className="h-20 flex flex-col justify-center px-8 border-b border-transparent">
          <h1 className="font-sans text-[15px] font-bold text-[#111827] leading-tight tracking-wide">
            Merchant Portal
          </h1>
          <p className="text-[9px] uppercase tracking-[0.15em] text-gray-500 mt-1">
            THE ARCHITECTURAL
            <br />
            CURATOR
          </p>
        </div>

        {/* Navigation Links - Updated Active State */}
        <nav className="flex-1 py-6 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center px-8 py-3 text-[13px] transition-all duration-200
                ${
                  isActive
                    ? "text-[#111827] bg-[#F9FAFB] border-l-4 border-[#111827] font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#111827] border-l-4 border-transparent font-medium"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-4.5 h-4.5 mr-3 stroke-2 ${isActive ? "text-[#111827]" : "text-gray-400"}`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <button className="w-full bg-[#111827] text-white flex items-center justify-center py-3 rounded-md text-[13px] font-semibold hover:bg-gray-800 transition-colors mb-6 shadow-sm">
            <Plus className="w-4 h-4 mr-2 stroke-[2.5]" /> Add New Product
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gray-200 text-gray-600 rounded flex items-center justify-center text-[11px] font-bold mr-3 uppercase">
                {user?.name ? user.name.substring(0, 2) : "PR"}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#111827]">
                  {user?.name || "Priya Verma"}
                </div>
                <div className="text-[10px] text-gray-500">
                  Principal Curator
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-[#111827] transition-colors p-2"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5 stroke-2" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
