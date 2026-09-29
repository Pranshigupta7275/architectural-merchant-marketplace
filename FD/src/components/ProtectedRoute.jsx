import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectCurrentToken,
  selectCurrentUser,
} from "../features/auth/authSlice";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  const location = useLocation();

  /*
   * No access token.
   * Send the user to login and remember
   * the page they originally requested.
   */
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  /*
   * Token exists but user information is missing.
   * This should not normally happen, but prevents
   * accidental access with corrupted localStorage.
   */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /*
   * Check role.
   */
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    /*
     * Customers belong to storefront.
     */
    if (user.role === "customer") {
      return <Navigate to="/" replace />;
    }

    /*
     * Admin and merchant belong to dashboard.
     */
    if (
      user.role === "admin" ||
      user.role === "merchant"
    ) {
      return <Navigate to="/admin" replace />;
    }

    /*
     * Unknown role.
     */
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;