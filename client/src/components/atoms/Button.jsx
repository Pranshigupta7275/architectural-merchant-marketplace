import { motion } from "framer-motion";

export const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
}) => {
  const baseClasses =
    "px-8 py-4 uppercase tracking-[0.15em] text-xs font-medium transition-colors duration-300 w-full md:w-auto text-center cursor-pointer";

  const variants = {
    primary:
      "bg-stone-900 text-stone-50 hover:bg-stone-800 disabled:bg-stone-300",
    secondary:
      "border border-stone-300 text-stone-900 hover:border-stone-900 bg-transparent",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.4 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
