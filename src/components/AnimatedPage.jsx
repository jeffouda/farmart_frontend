/**
 * AnimatedPage - A reusable page wrapper with consistent animations
 * 
 * Usage:
 * import AnimatedPage from '../components/AnimatedPage';
 * 
 * function MyPage() {
 *   return (
 *     <AnimatedPage>
 *       <YourPageContent />
 *     </AnimatedPage>
 *   );
 * }
 */

import { motion } from 'framer-motion';
import { pageVariants } from '../utils/framerMotionConfig';

/**
 * Page wrapper that adds entrance/exit animations
 * - Automatically handles page transitions
 * - Wrapped content remains fully functional
 * - Maintains all original props and children
 */
function AnimatedPage({ 
  children, 
  className = '',
  // Allow overriding variants if needed
  variants = pageVariants,
  // Disable animation for specific use cases
  animate = true 
}) {
  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;
