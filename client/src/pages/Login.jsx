import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCustomerCredentials } from "../store/customerAuthSlice";
// TODO: When ready, import your customer login mutation here
// import { useCustomerLoginMutation } from '../api/customerApi';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Temporary local state for UI
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [customerLogin] = useCustomerLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      /*
       * TODO: Phase 4 - Connect to actual backend
       * const userData = await customerLogin({ email, password }).unwrap();
       */

      // --- TEMPORARY MOCK AUTH FOR UI TESTING ---
      const mockUserData = {
        user: { name: "Elena Rostova", email: email },
        accessToken: "mock_jwt_token_123",
      };

      // Dispatch action to save token to the STOREFRONT Redux state
      dispatch(
        setCustomerCredentials({
          user: mockUserData.user,
          accessToken: mockUserData.accessToken,
        }),
      );

      console.log("Curator authenticated:", mockUserData);

      // Redirect to the storefront home or profile
      navigate("/");
    } catch (err) {
      console.error("Failed to authenticate:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20 pb-16">
      <div className="max-w-md w-full bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        {/* Luxury Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#111827] uppercase tracking-widest mb-3">
            Client Access
          </h2>
          <p className="text-[12px] text-gray-500 tracking-wide leading-relaxed">
            Enter your credentials to curate your collection and manage your
            architectural acquisitions.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-[12px] font-bold tracking-wide text-red-600 text-center uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-[13px] text-[#111827] transition-all duration-300 bg-transparent border-b border-gray-200 outline-none focus:border-[#111827] placeholder:text-gray-400"
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-[13px] text-[#111827] transition-all duration-300 bg-transparent border-b border-gray-200 outline-none focus:border-[#111827] placeholder:text-gray-400"
              placeholder="Password"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Link
              to="/forgot-password"
              className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#111827] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111827] hover:bg-gray-800 text-white text-[12px] font-bold uppercase tracking-widest py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-4"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center text-[12px] tracking-wide text-gray-500">
          Not a registered curator?{" "}
          <Link
            to="/register"
            className="text-[#111827] font-bold border-b border-[#111827] pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            Apply for Access
          </Link>
        </div>
      </div>
    </div>
  );
}
