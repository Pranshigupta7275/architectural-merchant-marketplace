import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- NETWORK & STATE IMPORTS ---
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../services/authApiSlice";
import { setCredentials } from "../../features/auth/authSlice";

export default function CustomerLogin() {
  // Toggle State: true = Login, false = Register
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize network requests for both Login and Registration
  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation();

  // Combined loading and error states for clean UI rendering
  const isLoading = isLoginLoading || isRegisterLoading;
  const currentError = isLogin ? loginError : registerError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;

      if (isLogin) {
        // 1A. Send LOGIN credentials
        response = await login({ email, password }).unwrap();
      } else {
        // 1B. Send REGISTRATION payload
        // Safely combine firstName and lastName to satisfy the backend's required 'name' field
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        response = await register({
          name: fullName,
          email,
          password,
        }).unwrap();
      }

      // 2. Save token and user info in Redux store
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );

      // 3. Route the user based on their specific role
      if (response.user?.role === "customer") {
        navigate("/shop");
      } else if (
        response.user?.role === "admin" ||
        response.user?.role === "merchant"
      ) {
        navigate("/admin");
      } else {
        // Fallback route if role is missing
        navigate("/");
      }
    } catch (err) {
      console.error(isLogin ? "Login failed:" : "Registration failed:", err);
    }
  };

  // Helper to safely toggle mode
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50/50">
      <motion.div
        layout
        className="w-full max-w-md p-8 transition-shadow bg-white border border-gray-100 shadow-xl rounded-2xl hover:shadow-2xl overflow-hidden"
      >
        {/* Header Title */}
        <motion.div layout="position" className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight">
            {isLogin ? "Portal Access" : "Join the Collection"}
          </h2>
          <p className="mt-2 text-[14px] text-gray-500">
            {isLogin
              ? "Sign in to view your architectural collections."
              : "Create an account to curate your exclusive assets."}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Animated Name Fields for Registration */}
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex gap-4"
              >
                <div className="flex-1">
                  <label className="block mb-1.5 text-[13px] font-bold tracking-wide text-gray-700 uppercase">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    className="w-full p-3 text-[14px] transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                    placeholder="Jane"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1.5 text-[13px] font-bold tracking-wide text-gray-700 uppercase">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    className="w-full p-3 text-[14px] transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                    placeholder="Doe"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <motion.div layout="position">
            <label className="block mb-1.5 text-[13px] font-bold tracking-wide text-gray-700 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-[14px] transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
              placeholder="curator@architectural.design"
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div layout="position">
            <label className="block mb-1.5 text-[13px] font-bold tracking-wide text-gray-700 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-[14px] transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            layout="position"
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full p-3 text-[14px] font-bold text-white transition-all bg-[#111827] rounded-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? "Authenticating..." : "Creating Account..."}
              </>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Toggle State Footer */}
        <motion.div layout="position" className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#111827] font-semibold hover:underline focus:outline-none cursor-pointer"
            >
              {isLogin ? "Register here." : "Sign in."}
            </button>
          </p>
        </motion.div>

        {/* Error Handling */}
        {currentError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mt-6 text-sm text-center text-red-600 bg-red-50 rounded-lg border border-red-100"
          >
            {/* Added fallback error reading incase standard message structure isn't found */}
            {currentError.data?.message ||
              currentError.error ||
              `${isLogin ? "Login" : "Registration"} failed. Please try again.`}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
