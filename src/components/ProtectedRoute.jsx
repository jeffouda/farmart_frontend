import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Debug: Log what we're checking
  console.log('🔐 Protected Route Check:', {
    currentUser,
    userRole: currentUser?.role,
    userRoleNested: currentUser?.user?.role,
    allowedRoles,
    pathname: location.pathname
  });

  // Condition A: Not Logged In - Redirect to /auth
  if (!currentUser) {
    console.log('❌ Not logged in, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Extract user role with fallback for nested structure
  let userRole = currentUser?.role;
  
  // Handle nested object structure (e.g., currentUser.user.role)
  if (!userRole && currentUser?.user?.role) {
    userRole = currentUser.user.role;
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

  // Condition B: Wrong Role - Check case-insensitively
  if (allowedRolesLower && userRoleLower && !allowedRolesLower.includes(userRoleLower)) {
    console.log('❌ Wrong role, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // Condition C: Success - Render the protected content
  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;
