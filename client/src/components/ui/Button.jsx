import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) {
  const variants = {
    primary: "bg-primary-navy text-white hover:bg-primary-navy/90",
    secondary:
      "bg-white text-primary-navy border border-border hover:bg-gray-50",
    ghost: "bg-transparent text-text-muted hover:bg-gray-100",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-colors duration-200
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}
