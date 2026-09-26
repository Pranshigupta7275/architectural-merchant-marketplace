import { motion } from "framer-motion";

const badgeVariants = {
  success: "bg-success/10 text-success",
  successDark: "bg-success-dark/10 text-success-dark",
  processing: "bg-processing text-processing-text",
};

export default function Badge({
  variant = "success",
  children,
  className = "",
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
}
