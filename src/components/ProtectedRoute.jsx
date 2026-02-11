import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Debug: Log what we're checking
  console.log('🔐 Protected Route Check:', {
    currentUser,
    loading,
    userRole: currentUser?.role,
    userRoleNested: currentUser?.user?.role,
    allowedRoles,
    pathname: location.pathname
  });

  // Condition A: Still loading - Show nothing while checking
  if (loading) {
    console.log('⏳ Auth still loading, showing spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Condition B: Not Logged In - Redirect to /auth
  if (!currentUser) {
    console.log('❌ Not logged in, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Extract user role with fallback for nested structure and array format
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
  const allowedRolesLower = allowedRoles?.map(role => role.toLowerCase());

  console.log('🔍 Role Check:', {
    userRoleRaw: userRole,
    userRoleLower,
    allowedRolesLower,
    isAllowed: allowedRolesLower?.includes(userRoleLower)
  });

  // Auto-redirect to correct dashboard based on role
  // If an admin tries to access any user dashboard, redirect to /admin
  if ((location.pathname === '/dashboard' || location.pathname.startsWith('/farmer-dashboard')) && userRoleLower === 'admin') {
    console.log('🔄 Admin trying to access user dashboard, redirecting to /admin');
    return <Navigate to="/admin" replace />;
  }

  // If a farmer tries to access /dashboard (buyer dashboard), redirect to /farmer-dashboard
  if (location.pathname === '/dashboard' && userRoleLower === 'farmer') {
    console.log('🔄 Farmer trying to access buyer dashboard, redirecting to /farmer-dashboard');
    return <Navigate to="/farmer-dashboard" replace />;
  }

  // If a buyer tries to access /farmer-dashboard, redirect to /dashboard
  if (location.pathname.startsWith('/farmer-dashboard') && userRoleLower === 'buyer') {
    console.log('🔄 Buyer trying to access farmer dashboard, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Condition C: Wrong Role - Check case-insensitively
  if (allowedRolesLower && allowedRolesLower.length > 0) {
    // If userRole is missing or undefined, redirect to unauthorized
    if (!userRoleLower) {
      console.log('❌ No user role found, redirecting to /unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
    // Check if user's role is in the allowed roles
    if (!allowedRolesLower.includes(userRoleLower)) {
      console.log('❌ Wrong role, redirecting to /unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Condition D: Success - Render the protected content
  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;
