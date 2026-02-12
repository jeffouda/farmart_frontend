import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_THEMES = {
  "/dashboard": {
    image: "https://images.unsplash.com/photo-1484557985045-6f550bb38a96?q=80&w=2000&auto=format&fit=crop",
    alt: "Farm Dashboard",
    overlay: "bg-slate-50/95",
  },
  "/browse": {
    image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2000&auto=format&fit=crop",
    alt: "Livestock Field",
    overlay: "bg-white/90",
  },
  "/orders": {
    image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2000&auto=format&fit=crop",
    alt: "Farm Logistics",
    overlay: "bg-slate-50/95",
  },
  "/negotiations": {
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2000&auto=format&fit=crop",
    alt: "Farm Fence",
    overlay: "bg-white/95",
  },
  "/farmer-dashboard": {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
    alt: "Farmer View",
    overlay: "bg-slate-50/95",
  },
  "/admin": {
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop",
    alt: "Admin Overview",
    overlay: "bg-slate-50/95",
  },
  default: {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
    alt: "General Farm",
    overlay: "bg-slate-50/95",
  },
};

const EXCLUDED_ROUTES = ["/", "/login", "/auth", "/signup", "/register"];

const ThemedBackground = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isExcluded = EXCLUDED_ROUTES.includes(currentPath);
  if (isExcluded) return null;

  const themeKey = Object.keys(PAGE_THEMES).find((key) => currentPath.startsWith(key)) || "default";
  const theme = PAGE_THEMES[themeKey];

  return (
    <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={themeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={theme.image}
            alt={theme.alt}
            className="w-full h-full object-cover object-center"
          />
          <div className={`absolute inset-0 ${theme.overlay} backdrop-blur-[2px]`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ThemedBackground;
