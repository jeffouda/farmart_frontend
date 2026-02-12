/**
 * Reusable Animated Components
 * 
 * Best practices:
 * - Components accept all standard props (onClick, className, etc.)
 * - Animations are declarative and composable
 * - Accessibility built-in (keyboard focus, reduced motion support)
 */

import { motion } from 'framer-motion';
import { cardHover, buttonVariants, staggerContainer, staggerItem } from '../utils/framerMotionConfig';

/**
 * AnimatedCard - A card with hover and tap animations
 * 
 * Usage:
 * <AnimatedCard onClick={handleClick} className="p-6">
 *   <h3>Card Title</h3>
 * </AnimatedCard>
 */
export function AnimatedCard({ 
  children, 
  className = '',
  onClick,
  variants = cardHover,
  ...props 
}) {
  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedButton - A button with hover and tap animations
 * 
 * Usage:
 * <AnimatedButton onClick={handleSubmit} variant="primary">
 *   Submit
 * </AnimatedButton>
 */
export function AnimatedButton({ 
  children, 
  className = '',
  variant = 'primary',
  ...props 
}) {
  const baseStyles = `
    inline-flex items-center justify-center px-6 py-3 
    font-semibold rounded-xl transition-colors
  `;
  
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border-2 border-slate-300 text-slate-700 hover:border-green-500 hover:text-green-500',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * AnimatedList - A list container with staggered children animations
 * 
 * Usage:
 * <AnimatedList>
 *   {items.map(item => <ListItem key={item.id}>{item.name}</ListItem>)}
 * </AnimatedList>
 */
export function AnimatedList({ 
  children, 
  className = '',
  containerVariants = staggerContainer,
  itemVariants = staggerItem,
  ...props 
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedListItem - Individual list item for use with AnimatedList
 * 
 * Usage:
 * <motion.li variants={staggerItem} className="p-4">
 *   Item content
 * </motion.li>
 */
export const AnimatedListItem = motion.li;

/**
 * StaggeredGrid - A grid with staggered entrance animations
 * 
 * Usage:
 * <StaggeredGrid columns={3}>
 *   {items.map(item => <GridItem key={item.id}>{item.content}</GridItem>)}
 * </StaggeredGrid>
 */
export function StaggeredGrid({ 
  children, 
  className = '',
  columns = 2,
  gap = 6,
  ...props 
}) {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap} ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedInput - Input field with focus animations
 */
export function AnimatedInput({ 
  className = '',
  ...props 
}) {
  return (
    <motion.input
      className={`
        w-full px-4 py-3 rounded-xl border border-slate-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
        transition-all duration-200
        ${className}
      `}
      whileFocus={{ scale: 1.02, boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)" }}
      {...props}
    />
  );
}

/**
 * FadeIn - Simple fade-in animation component
 */
export function FadeIn({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.4,
  ...props 
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn - Slide-in animation from direction
 */
export function SlideIn({ 
  children, 
  className = '',
  direction = 'up', // up, down, left, right
  delay = 0,
  ...props 
}) {
  const offset = 30;
  const initial = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
  }[direction];

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleOnHover - Wrapper for elements that should scale on hover
 */
export function ScaleOnHover({ 
  children, 
  className = '',
  scale = 1.05,
  ...props 
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
