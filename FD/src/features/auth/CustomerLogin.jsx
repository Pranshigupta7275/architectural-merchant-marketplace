import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Globe2,
  ShieldCheck,
  Leaf,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- NETWORK & STATE IMPORTS ---
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../services/authApiSlice";

import { setCredentials } from "../../features/auth/authSlice";

export default function CustomerLogin() {
  // ============================================================
  // STATE
  // ============================================================

  const [isLogin, setIsLogin] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("curator@architectural.design");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================================
  // API
  // ============================================================

  const [
    login,
    {
      isLoading: isLoginLoading,
      error: loginError,
    },
  ] = useLoginMutation();

  const [
    register,
    {
      isLoading: isRegisterLoading,
      error: registerError,
    },
  ] = useRegisterMutation();

  const isLoading = isLoginLoading || isRegisterLoading;

  const currentError = isLogin
    ? loginError
    : registerError;

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isLogin) {
        // LOGIN
        response = await login({
          email,
          password,
        }).unwrap();
      } else {
        // REGISTRATION
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        response = await register({
          name: fullName,
          email,
          password,
        }).unwrap();
      }

      // Save credentials
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        })
      );

      // Preserve deep-link destination
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, {
          replace: true,
        });
      } else if (response.user?.role === "customer") {
        navigate("/shop");
      } else if (
        response.user?.role === "admin" ||
        response.user?.role === "merchant"
      ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(
        isLogin ? "Login failed:" : "Registration failed:",
        err
      );
    }
  };

  // ============================================================
  // ERROR MESSAGE
  // ============================================================

  const getErrorMessage = () => {
    if (!currentError) return "";

    const apiError =
      currentError?.error || currentError;

    return (
      apiError?.data?.message ||
      apiError?.message ||
      (currentError?.status === "FETCH_ERROR"
        ? "Cannot reach the server. Please ensure the backend is running."
        : currentError?.status === "TIMEOUT"
          ? "Request timed out. Please try again."
          : `${isLogin ? "Login" : "Registration"} failed. Please try again.`)
    );
  };

  // ============================================================
  // TOGGLE
  // ============================================================

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#F6F3EC] text-[#17191D]">

      <div className="flex min-h-screen">

        {/* =====================================================
            LEFT SIDE — ARCHITECTURAL HERO
        ===================================================== */}

        <section className="relative hidden min-h-screen w-[52%] overflow-hidden lg:flex">

          {/* Background Image */}
          <div className="absolute inset-0">

            <img
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=90&w=2200&auto=format&fit=crop"
              alt="Luxury architectural interior"
              className="h-full w-full object-cover object-center"
            />

            {/* Main cinematic overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Left dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />

          </div>

          {/* =================================================
              SUBTLE ARCHITECTURAL GRID
          ================================================= */}

          <div className="pointer-events-none absolute inset-0 opacity-[0.06]">

            <div className="absolute left-[15%] top-0 h-full w-px bg-white" />

            <div className="absolute left-[30%] top-0 h-full w-px bg-white" />

            <div className="absolute left-[70%] top-0 h-full w-px bg-white" />

            <div className="absolute left-[85%] top-0 h-full w-px bg-white" />

            <div className="absolute left-0 top-[25%] h-px w-full bg-white" />

            <div className="absolute left-0 top-[75%] h-px w-full bg-white" />

          </div>

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* -------------------------------------------------
                BRAND
            ------------------------------------------------- */}

            <motion.div
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >

              <div className="flex items-center gap-4">

                {/* Architectural logo */}
                <div className="relative flex h-[48px] w-[40px] items-center justify-center">

                  <div className="absolute inset-0 rounded-t-[22px] border border-[#C5A059]/80" />

                  <svg
                    viewBox="0 0 40 48"
                    className="h-8 w-7 text-[#C5A059]"
                    fill="none"
                  >

                    <path
                      d="M20 4L5 15V43H35V15L20 4Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />

                    <path
                      d="M13 43V27H27V43"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />

                    <path
                      d="M20 4V27"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />

                  </svg>

                </div>

                <div>

                  <div className="font-serif text-[15px] leading-tight tracking-[0.34em] text-white">
                    ARCHITECTURAL
                  </div>

                  <div className="font-serif text-[13px] tracking-[0.42em] text-white/70">
                    CURATOR
                  </div>

                </div>

              </div>

              <div className="mt-4 flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.28em] text-white/65">

                <span>Premium Spaces</span>

                <span className="text-[#C5A059]">/</span>

                <span>Exceptional Materials</span>

                <span className="text-[#C5A059]">/</span>

                <span>Global Sources</span>

              </div>

            </motion.div>

            {/* -------------------------------------------------
                HERO COPY
            ------------------------------------------------- */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="mt-auto max-w-[580px] pb-9"
            >

              <div className="mb-5 h-px w-12 bg-[#C5A059]" />

              <h1 className="font-serif text-[46px] font-normal leading-[1.04] tracking-[-0.025em] text-white xl:text-[58px]">

                Connecting
                <br />

                Architects with
                <br />

                Extraordinary
                <br />

                Spaces

              </h1>

              <p className="mt-7 max-w-[440px] text-[14px] font-light leading-[1.8] text-white/70">

                Access exclusive materials, timeless furniture and
                meticulously curated architectural pieces — all in one
                place, for your next masterpiece.

              </p>

            </motion.div>

            {/* -------------------------------------------------
                FEATURES
            ------------------------------------------------- */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.35,
              }}
              className="border-t border-white/15 pt-7"
            >

              <div className="grid max-w-[600px] grid-cols-4 gap-5">

                <Feature
                  icon={Sparkles}
                  title="Premium"
                  subtitle="Collections"
                />

                <Feature
                  icon={Globe2}
                  title="Global"
                  subtitle="Sourcing"
                />

                <Feature
                  icon={ShieldCheck}
                  title="Trusted"
                  subtitle="Merchants"
                />

                <Feature
                  icon={Leaf}
                  title="Sustainable"
                  subtitle="Choices"
                />

              </div>

            </motion.div>

            {/* -------------------------------------------------
                SIGNATURE
            ------------------------------------------------- */}

            <div className="mt-8 flex items-center gap-4">

              <span className="font-serif text-[27px] italic text-[#C5A059]">
                Build Beautiful
              </span>

              <div className="h-px w-24 bg-gradient-to-r from-[#C5A059] to-transparent" />

            </div>

          </div>

        </section>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7F5F0] px-5 py-10 sm:px-10 lg:w-[48%] lg:px-14 xl:px-20">

          {/* =================================================
              ARCHITECTURAL LINE ART
          ================================================= */}

          <div className="pointer-events-none absolute bottom-[-80px] right-[-80px] opacity-[0.055]">

            <svg
              width="550"
              height="650"
              viewBox="0 0 550 650"
              fill="none"
            >

              <path
                d="M60 610V220L275 50L490 220V610"
                stroke="#17191D"
                strokeWidth="2"
              />

              <path
                d="M125 610V275L275 150L425 275V610"
                stroke="#17191D"
                strokeWidth="2"
              />

              <path
                d="M185 610V355H365V610"
                stroke="#17191D"
                strokeWidth="2"
              />

              <path
                d="M60 220L275 50L490 220"
                stroke="#17191D"
                strokeWidth="2"
              />

              <path
                d="M105 250L275 110L445 250"
                stroke="#17191D"
                strokeWidth="1.5"
              />

              <path
                d="M275 50V610"
                stroke="#17191D"
                strokeWidth="1"
              />

            </svg>

          </div>

          {/* =================================================
              TOP RIGHT CATEGORY
          ================================================= */}

          <div className="absolute right-8 top-8 hidden items-start gap-5 xl:flex">

            <div className="h-[70px] w-px bg-[#C5A059]" />

            <div className="flex flex-col gap-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-[#8E8A81]">

              <span>Architecture</span>
              <span>Interiors</span>
              <span>Materials</span>
              <span>Marketplace</span>

            </div>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.65,
              ease: "easeOut",
            }}
            className="
              relative
              z-10
              w-full
              max-w-[490px]
              rounded-[28px]
              border
              border-[#E5E1D8]
              bg-[#FFFDFC]
              px-7
              py-9
              shadow-[0_25px_70px_rgba(38,35,30,0.08)]
              sm:px-11
              sm:py-11
            "
          >

            {/* Gold detail */}
            <div className="mx-auto mb-7 h-px w-12 bg-[#C5A059]" />

            {/* =================================================
                HEADER
            ================================================= */}

            <motion.div
              layout
              className="mb-9 text-center"
            >

              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.38em] text-[#A47B3E]">

                {isLogin
                  ? "WELCOME BACK"
                  : "WELCOME"}

              </p>

              <h2 className="font-serif text-[38px] font-normal leading-none tracking-[-0.025em] text-[#15181D]">

                {isLogin
                  ? "Portal Access"
                  : "Join the Collection"}

              </h2>

              <p className="mt-3 text-[12px] font-light text-[#77746E]">

                {isLogin
                  ? "Sign in to your architectural collections."
                  : "Create an account to curate your exclusive assets."}

              </p>

            </motion.div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =================================================
                  REGISTRATION NAME
              ================================================= */}

              <AnimatePresence mode="popLayout">

                {!isLogin && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -10,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="flex gap-3 overflow-hidden"
                  >

                    <LuxuryInput
                      label="First Name"
                      value={firstName}
                      onChange={setFirstName}
                      placeholder="Jane"
                      required={!isLogin}
                    />

                    <LuxuryInput
                      label="Last Name"
                      value={lastName}
                      onChange={setLastName}
                      placeholder="Doe"
                      required={!isLogin}
                    />

                  </motion.div>
                )}

              </AnimatePresence>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <motion.div layout="position">

                <LuxuryLabel>
                  Email Address
                </LuxuryLabel>

                <div className="group flex h-[56px] items-center rounded-[12px] border border-[#DEDAD1] bg-[#FAF9F6] transition-all duration-200 focus-within:border-[#B18A4D] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(177,138,77,0.08)]">

                  <div className="pl-4 pr-3 text-[#88857E]">

                    <Mail
                      className="h-[19px] w-[19px] stroke-[1.4]"
                    />

                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="curator@architectural.design"
                    className="h-full w-full bg-transparent pr-4 text-[12px] font-medium text-[#17191D] outline-none placeholder:text-[#AAA69D]"
                  />

                </div>

              </motion.div>

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <motion.div layout="position">

                <LuxuryLabel>
                  Password
                </LuxuryLabel>

                <div className="flex h-[56px] items-center rounded-[12px] border border-[#DEDAD1] bg-[#FAF9F6] transition-all duration-200 focus-within:border-[#B18A4D] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(177,138,77,0.08)]">

                  <div className="pl-4 pr-3 text-[#88857E]">

                    <Lock
                      className="h-[19px] w-[19px] stroke-[1.4]"
                    />

                  </div>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="h-full w-full bg-transparent text-[12px] font-medium text-[#17191D] outline-none placeholder:text-[#AAA69D]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="mr-4 text-[#96928A] transition-colors hover:text-[#3C3B38]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff className="h-[19px] w-[19px] stroke-[1.4]" />
                    ) : (
                      <Eye className="h-[19px] w-[19px] stroke-[1.4]" />
                    )}

                  </button>

                </div>

              </motion.div>

              {/* =================================================
                  REMEMBER / FORGOT
              ================================================= */}

              {isLogin && (
                <div className="flex items-center justify-between pt-1">

                  <label className="group flex cursor-pointer items-center gap-2">

                    <div className="relative">

                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                          setRememberMe(
                            e.target.checked
                          )
                        }
                        className="peer h-[16px] w-[16px] cursor-pointer appearance-none rounded-[4px] border border-[#D1CDC4] bg-white checked:border-[#171B22] checked:bg-[#171B22]"
                      />

                      <Check
                        className="pointer-events-none absolute left-[3px] top-[3px] h-[10px] w-[10px] text-white opacity-0 peer-checked:opacity-100"
                      />

                    </div>

                    <span className="text-[11px] text-[#66635D]">
                      Remember me
                    </span>

                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="text-[11px] font-medium text-[#9A7239] underline decoration-[#C5A059]/50 underline-offset-4 transition-colors hover:text-[#6F522A]"
                  >
                    Forgot password?
                  </button>

                </div>
              )}

              {/* =================================================
                  ERROR
              ================================================= */}

              <AnimatePresence>

                {currentError && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden rounded-[9px] border border-red-100 bg-red-50 px-3 py-2.5 text-center text-[11px] font-medium text-red-600"
                  >
                    {getErrorMessage()}
                  </motion.div>
                )}

              </AnimatePresence>

              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}

              <motion.button
                layout="position"
                type="submit"
                disabled={isLoading}
                whileTap={{
                  scale: 0.99,
                }}
                className="
                  group
                  relative
                  mt-2
                  flex
                  h-[58px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  rounded-[11px]
                  border
                  border-[#C5A059]
                  bg-[#181D24]
                  text-[12px]
                  font-semibold
                  tracking-[0.08em]
                  text-white
                  shadow-[0_8px_25px_rgba(20,23,29,0.15)]
                  transition-all
                  duration-300
                  hover:bg-[#10141A]
                  hover:shadow-[0_12px_30px_rgba(20,23,29,0.2)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#C5A059]" />

                    <span>
                      {isLogin
                        ? "AUTHENTICATING..."
                        : "CREATING ACCOUNT..."}
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowRight
                      className="h-[17px] w-[17px] text-[#C5A059] transition-transform duration-300 group-hover:translate-x-1"
                    />

                    <span>
                      {isLogin
                        ? "SIGN IN"
                        : "CREATE ACCOUNT"}
                    </span>
                  </>
                )}

              </motion.button>

            </form>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#E7E3DA]" />

              <span className="text-[9px] font-bold tracking-[0.25em] text-[#A09C94]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#E7E3DA]" />

            </div>

            {/* =================================================
                TOGGLE
            ================================================= */}

            <motion.div
              layout="position"
              className="text-center"
            >

              <span className="text-[11px] font-light text-[#77736B]">

                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                {" "}

              </span>

              <button
                type="button"
                onClick={toggleMode}
                className="text-[11px] font-medium text-[#9A7239] underline decoration-[#C5A059]/50 underline-offset-4 transition-colors hover:text-[#6F522A]"
              >

                {isLogin
                  ? "Register here."
                  : "Sign in."}

              </button>

            </motion.div>

            {/* =================================================
                MICRO BRANDING
            ================================================= */}

            <div className="mt-9 text-center">

              <span className="text-[8px] uppercase tracking-[0.28em] text-[#B1ADA5]">
                Architectural Curator · Merchant Portal
              </span>

            </div>

          </motion.div>

        </section>

      </div>
    </div>
  );
}

/* =============================================================
   LUXURY LABEL
============================================================= */

function LuxuryLabel({ children }) {
  return (
    <label className="mb-2.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#55534F]">
      {children}
    </label>
  );
}

/* =============================================================
   LUXURY INPUT
============================================================= */

function LuxuryInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div className="min-w-0 flex-1">

      <LuxuryLabel>
        {label}
      </LuxuryLabel>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="
          h-[56px]
          w-full
          rounded-[12px]
          border
          border-[#DEDAD1]
          bg-[#FAF9F6]
          px-4
          text-[12px]
          font-medium
          text-[#17191D]
          outline-none
          placeholder:text-[#AAA69D]
          transition-all
          duration-200
          focus:border-[#B18A4D]
          focus:bg-white
          focus:shadow-[0_0_0_3px_rgba(177,138,77,0.08)]
        "
      />

    </div>
  );
}

/* =============================================================
   FEATURE
============================================================= */

function Feature({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex flex-col items-start gap-2">

      <Icon
        className="h-[19px] w-[19px] stroke-[1.2] text-[#C5A059]"
      />

      <div className="text-[9px] font-medium uppercase leading-[1.45] tracking-[0.12em] text-white/65">

        <div>{title}</div>

        <div>{subtitle}</div>

      </div>

    </div>
  );
}