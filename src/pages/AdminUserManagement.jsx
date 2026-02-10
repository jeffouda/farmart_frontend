import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  MapPin,
  Star,
  Calendar,
  X
} from "lucide-react";
import toast from "react-hot-toast";

// Mock Data
const mockFarmers = [
  {
    id: 1,
    name: "John Kamau",
    email: "john@farm.com",
    location: "Nairobi County",
    status: "pending",
    rating: 4.5,
    joinDate: "2024-01-15",
    livestockCount: 15,
    verified: false,
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    email: "sarah@farm.com",
    location: "Kiambu County",
    status: "active",
    rating: 4.8,
    joinDate: "2023-11-20",
    livestockCount: 28,
    verified: true,
  },
  {
    id: 3,
    name: "Mike Ochieng",
    email: "mike@farm.com",
    location: "Kisumu County",
    status: "suspended",
    rating: 3.2,
    joinDate: "2023-09-10",
    livestockCount: 8,
    verified: true,
  },
  {
    id: 4,
    name: "Grace Achieng",
    email: "grace@farm.com",
    location: "Nakuru County",
    status: "pending",
    rating: 0,
    joinDate: "2024-02-01",
    livestockCount: 0,
    verified: false,
  },
  {
    id: 5,
    name: "Peter Muturi",
    email: "peter@farm.com",
    location: "Murang'a County",
    status: "active",
    rating: 4.6,
    joinDate: "2023-08-05",
    livestockCount: 42,
    verified: true,
  },
];

const mockBuyers = [
  {
    id: 101,
    name: "Alice Johnson",
    email: "alice@email.com",
    location: "Westlands, Nairobi",
    status: "active",
    totalOrders: 12,
    joinDate: "2023-12-01",
  },
  {
    id: 102,
    name: "Bob Smith",
    email: "bob@email.com",
    location: "Karen, Nairobi",
    status: "active",
    totalOrders: 5,
    joinDate: "2024-01-10",
  },
  {
    id: 103,
    name: "Carol Williams",
    email: "carol@email.com",
    location: "Mombasa",
    status: "suspended",
    totalOrders: 2,
    joinDate: "2023-06-15",
  },
];

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    suspended: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.active}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};