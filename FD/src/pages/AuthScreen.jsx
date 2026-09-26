import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// IMPORTANT: Make sure these import paths match your folder structure!
import {
  useLoginMutation,
  useRegisterMutation,
} from "../features/usersApiSlice";
import { setCredentials } from "../features/auth/authSlice";

const AuthScreen = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant");

  // Feedback State
  const [successMessage, setSuccessMessage] = useState(null);

  // Initialize Routing & Redux Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  // Smart Routing: Check URL for a redirect parameter, default to Dashboard ('/')
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Grab user info from Redux
  const { userInfo } = useSelector((state) => state.auth);

  // Initialize RTK Query Hooks
  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation();

  // SMART ROUTING EFFECT: If already logged in, bounce them to their destination
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      let res;

      if (isLoginMode) {
        res = await login({ email, password }).unwrap();
      } else {
        res = await register({ name, email, password, role }).unwrap();
      }

      if (res.success || res.accessToken) {
        // 1. Dispatch to Redux! (This also handles LocalStorage automatically now)
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
          }),
        );

        // 2. Clear the form
        setEmail("");
        setPassword("");
        setName("");

        // 3. The route automatically fires via the useEffect above, but we can force it here for safety
        navigate(redirect);
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  const currentError = isLoginMode ? loginError : registerError;
  const isCurrentlyLoading = isLoginMode ? isLoginLoading : isRegisterLoading;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>{isLoginMode ? "Admin Login" : "Merchant Registration"}</h2>

      {currentError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {currentError?.data?.message || "Invalid email or password"}
        </div>
      )}

      {successMessage && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          {successMessage}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {!isLoginMode && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "10px" }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: "10px" }}
            >
              <option value="merchant">Merchant</option>
              <option value="admin">Platform Admin</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="submit"
          disabled={isCurrentlyLoading}
          style={{
            padding: "10px",
            backgroundColor: isCurrentlyLoading ? "#888" : "#333",
            color: "white",
            cursor: isCurrentlyLoading ? "not-allowed" : "pointer",
          }}
        >
          {isCurrentlyLoading
            ? "Processing..."
            : isLoginMode
              ? "Sign In"
              : "Register Account"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          type="button"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setSuccessMessage(null);
          }}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {isLoginMode
            ? "Don't have an account? Register here"
            : "Already have an account? Login here"}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
