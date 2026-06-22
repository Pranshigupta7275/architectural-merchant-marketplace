import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutApiCallMutation } from "../features/usersApiSlice";
import { logout } from "../features/auth/authSlice";

const HeaderProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Grab the user data from Redux to know if they are logged in
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutApiCallMutation();

  // 2. Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. The Secure Logout Execution
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setIsOpen(false);
      navigate("/login"); // Send them to the login page after clearing data
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* The Trigger Button (Your User Icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "50%",
          backgroundColor: userInfo ? "#e2e8f0" : "transparent", // Highlight if logged in
        }}
      >
        {/* Simple SVG User Icon (Matches your screenshot style) */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "0",
            width: "200px",
            backgroundColor: "white",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "8px",
            padding: "8px 0",
            zIndex: 50,
            border: "1px solid #e2e8f0",
          }}
        >
          {/* CONDITIONAL RENDERING: Logged In vs Logged Out */}
          {userInfo ? (
            // --- WHAT THE ADMIN SEES ---
            <>
              <div
                style={{
                  padding: "8px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  marginBottom: "4px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#1e293b",
                  }}
                >
                  {userInfo.name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                  {userInfo.email}
                </p>
              </div>
              <Link
                to="/admin/profile"
                style={dropdownItemStyle}
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/admin/settings"
                style={dropdownItemStyle}
                onClick={() => setIsOpen(false)}
              >
                Account Settings
              </Link>
              <button
                onClick={logoutHandler}
                style={{
                  ...dropdownItemStyle,
                  color: "#ef4444",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            // --- WHAT A GUEST SEES ---
            <>
              <div style={{ padding: "8px 16px", marginBottom: "4px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                  Welcome to Merchant Portal
                </p>
              </div>
              <Link
                to="/login"
                style={dropdownItemStyle}
                onClick={() => setIsOpen(false)}
              >
                <strong>Sign In</strong>
              </Link>
              <Link
                to="/login"
                style={dropdownItemStyle}
                onClick={() => setIsOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable inline style for the dropdown links
const dropdownItemStyle = {
  display: "block",
  padding: "8px 16px",
  textDecoration: "none",
  color: "#334155",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

export default HeaderProfile;
