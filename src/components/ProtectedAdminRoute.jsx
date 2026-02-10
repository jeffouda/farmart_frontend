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