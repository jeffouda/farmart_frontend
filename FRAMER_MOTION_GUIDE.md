# Framer Motion Best Practices Guide

## Overview

This guide provides best practices for adding smooth animations to React pages without breaking functionality.

## Core Principles

### 1. Separate Animation from Logic

**❌ Bad:** Mixing animation state with business logic
```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    fetchUsers().then(() => {
      setAnimationComplete(true);
    });
  }, []);

  return (
    <motion.div animate={animationComplete ? { opacity: 1 } : { opacity: 0 }}>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </motion.div>
  );
}
```

**✅ Good:** Animations don't affect data flow
```jsx
import { staggerContainer } from '../utils/framerMotionConfig';

function UserList({ users }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </motion.div>
  );
}
```

### 2. Use Semantic Animation Names

```jsx
// ✅ Good - Clear intent
const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
  tap: { scale: 0.98 }
};

// ❌ Bad - Unclear purpose
const animation1 = {
  start: { opacity: 0 },
  finish: { opacity: 1 }
};
```

### 3. Optimize for Performance

**Use transform properties (GPU-accelerated):**
```jsx
// ✅ Good - Uses transform (60fps)
<motion.div animate={{ x: 100, scale: 1.1 }}>

// ❌ Bad - Triggers layout recalculation
<motion.div animate={{ left: 100, width: 200 }}>
```

**Use will-change sparingly:**
```jsx
<motion.div 
  animate={{ opacity: [0, 1] }}
  transition={{ willChange: true }} // Only when needed
>
```

### 4. Respect Accessibility

```jsx
import { useReducedMotion } from '../utils/framerMotionConfig';

function AccessibleCard({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { scale: 1.05 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```

### 5. Use Consistent Timing

```jsx
import { duration, easing } from '../utils/framerMotionConfig';

// ✅ Good - Consistent across components
<motion.div 
  transition={{ 
    duration: duration.normal, 
    ease: easing.gentle 
  }}
/>

// ❌ Bad - Inconsistent timing
<motion.div transition={{ duration: 0.3, ease: "easeInOut" }} />
<motion.div transition={{ duration: 0.5, ease: "circOut" }} />
```

## Common Patterns

### Pattern 1: Page with Staggered Cards

```jsx
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { staggerContainer, staggerItem } from '../utils/framerMotionConfig';

function Dashboard() {
  const cards = [
    { title: 'Revenue', value: '$48k' },
    { title: 'Users', value: '2,845' },
    { title: 'Orders', value: '156' },
  ];

  return (
    <AnimatedPage>
      <div className="grid grid-cols-3 gap-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              variants={staggerItem}
              custom={i}
              className="p-6 bg-white rounded-xl"
            >
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
```

### Pattern 2: List with Staggered Items

```jsx
import { motion } from 'framer-motion';
import { listItemVariants } from '../utils/framerMotionConfig';

function NotificationList({ notifications }) {
  return (
    <ul className="space-y-4">
      {notifications.map((notification, i) => (
        <motion.li
          key={notification.id}
          variants={listItemVariants}
          custom={i}
          initial="hidden"
          animate="visible"
          className="p-4 bg-white rounded-lg"
        >
          {notification.message}
        </motion.li>
      ))}
    </ul>
  );
}
```

### Pattern 3: Modal with Overlay

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariants, overlayVariants } from '../utils/framerMotionConfig';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white rounded-2xl p-8 max-w-md">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Pattern 4: Interactive Card

```jsx
import { AnimatedCard } from '../components/AnimatedComponents';

function ProductCard({ product, onClick }) {
  return (
    <AnimatedCard
      className="p-6 bg-white shadow-sm"
      onClick={() => onClick(product.id)}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </AnimatedCard>
  );
}
```

## Animation Checklist

Before adding animations, verify:

- [ ] **No layout shifts** - Content doesn't jump during animation
- [ ] **Accessibility respected** - `prefers-reduced-motion` handled
- [ ] **Performance considered** - Using `transform`, not `width/height`
- [ ] **Consistent timing** - Using shared duration/easing constants
- [ ] **Semantic naming** - Variants have clear names (hover, tap, rest)
- [ ] **Keyframes avoided** - Simple transitions preferred over complex keyframes
- [ ] **Exit animations work** - `AnimatePresence` used for conditional rendering

## File Structure

```
src/
├── components/
│   ├── AnimatedPage.jsx      # Page wrapper
│   └── AnimatedComponents.jsx # Reusable animated components
├── utils/
│   └── framerMotionConfig.js # Animation constants & helpers
└── pages/
    └── YourPage.jsx          # Uses the above components
```

## Quick Reference

| Component | Use For |
|-----------|---------|
| `AnimatedPage` | Page transitions |
| `AnimatedCard` | Interactive cards with hover/tap |
| `AnimatedButton` | Buttons with feedback |
| `AnimatedList` | Lists with staggered items |
| `AnimatedInput` | Form inputs with focus |
| `FadeIn` | Simple fade-in |
| `SlideIn` | Slide from direction |
| `ScaleOnHover` | Simple hover scale |

## Common Issues

### Issue: Hydration Mismatch in Next.js

```jsx
// ❌ Causes hydration errors
<motion.div initial={{ opacity: 0 }}>

// ✅ Safe for SSR
<motion.div 
  initial={{ opacity: 0 }}
  animate={typeof window !== 'undefined' ? { opacity: 1 } : {}}
>
```

### Issue: Animation interrupts user interaction

```jsx
// ❌ Animation blocks clicks during exit
<motion.div exit={{ opacity: 0 }}>
  <button>Click me</button>
</motion.div>

// ✅ User can interact before exit
<AnimatePresence mode="wait">
  <motion.div
    key={content}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <button>Click me</button>
  </motion.div>
</AnimatePresence>
```

### Issue: Memory leaks from unmounted animations

```jsx
// ❌ Can cause memory leaks
<motion.div animate={{ x: 100 }}>
  <ComplexComponent />
</motion.div>

// ✅ Cleanup on unmount
<AnimatePresence mode="wait">
  {show && (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ComplexComponent />
    </motion.div>
  )}
</AnimatePresence>
```
