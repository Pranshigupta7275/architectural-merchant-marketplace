// src/storefront/utils/animations.js

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const slideIn = (direction = "right") => ({
  hidden: { 
    opacity: 0, 
    x: direction === "right" ? 50 : direction === "left" ? -50 : 0,
    y: direction === "up" ? 50 : direction === "down" ? -50 : 0
  },
  show: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
});

export const hoverLift = {
  rest: { y: 0, boxShadow: "0 10px 40px -10px rgba(26, 26, 26, 0.08)" },
  hover: { 
    y: -4, 
    boxShadow: "0 20px 40px -10px rgba(26, 26, 26, 0.12)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};