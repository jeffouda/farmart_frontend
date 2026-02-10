import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/**
 * ProtectedAdminRoute - Security component for admin routes
 *
 * Logic:
 * 1. Check if user is authenticated
 * 2. Check if user.role === 'admin'
 * 3. If Yes: Render children (admin page)
 * 4. If No (but logged in): Redirect to / with "Access Denied" toast
 * 5. If Not Logged In: Redirect to /login (/auth in this app)
 */
const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Condition A: Still loading - Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Condition B: Not Logged In - Redirect to /auth (login)
  if (!currentUser) {
    console.log("🔐 Admin Route: Not logged in, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Extract user role with fallback for nested structures
  let userRole = currentUser?.role;

  // Handle nested object structure (e.g., currentUser.user.role)
  if (!userRole && currentUser?.user?.role) {
    userRole = currentUser.user.role;
  }

  // Handle array format (e.g., currentUser[0]?.role)
  if (!userRole && Array.isArray(currentUser) && currentUser.length > 0) {
    userRole = currentUser[0]?.role;
  }

  // Make role check case-insensitive
  const userRoleLower = userRole?.toLowerCase();

  // Condition C: Not an admin - Show access denied and redirect to home
  if (userRoleLower !== "admin") {
    console.log("🔐 Admin Route: Access denied - user role is:", userRole);

    // Show toast notification
    toast.error("Access Denied: Admin privileges required", {
      duration: 4000,
      icon: "🚫",
    });

    // Redirect to home page
    return <Navigate to="/" replace />;
  }

  // Condition D: Success - User is admin, render the admin page
  console.log("🔐 Admin Route: Access granted for admin user");
  return children;
};

export default ProtectedAdminRoute;
