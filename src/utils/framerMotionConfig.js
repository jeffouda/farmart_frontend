/**
 * Framer Motion Animation Configuration & Best Practices
 * 
 * Principles:
 * 1. Separate animation variants from components
 * 2. Use semantic naming for animations
 * 3. Optimize for performance (transform, opacity)
 * 4. Respect accessibility (prefers-reduced-motion)
 * 5. Use consistent easing curves
 */

import { Variants } from 'framer-motion';

// Easing curves for consistent feel
export const easing = {
  gentle: [0.25, 0.1, 0.25, 1],      // Smooth, natural
  snappy: [0.4, 0, 0.2, 1],         // Quick response
  bouncy: [0.68, -0.55, 0.265, 1.55], // Spring-like
  smooth: [0.42, 0, 0.58, 1],        // Standard ease
};

// Duration constants for consistency
export const duration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
};

// Page transition animations
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.gentle,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: duration.fast,
      ease: easing.smooth,
    },
  },
};

// Staggered children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.gentle,
    },
  },
};

// Card hover animations
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    transition: {
      duration: duration.fast,
      ease: easing.gentle,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: duration.fast,
    },
  },
};

// Button animations
export const buttonVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: duration.fast,
      ease: easing.gentle,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// Sidebar animations
export const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: -280,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

// Modal/overlay animations
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.gentle,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.fast,
      ease: easing.smooth,
    },
  },
};

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast },
  },
};

// List item animations
export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: duration.normal,
      ease: easing.gentle,
    },
  }),
};

// Fade animations
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.gentle },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal },
  },
};

// Scale animations
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.gentle },
  },
};

// Slide animations
export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.gentle },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.gentle },
  },
};

// Check if user prefers reduced motion
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get animation variants based on reduced motion preference
export const getAdaptiveVariants = (normalVariants, reducedVariants) => {
  const reduced = useReducedMotion();
  return reduced ? reducedVariants : normalVariants;
};

// Re-export framer-motion components with optimized settings
export { AnimatePresence, motion } from 'framer-motion';
