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

// Action Menu Component
const ActionMenu = ({ user, onAction }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-20 overflow-hidden">
            {user.status === "pending" && (
              <button
                onClick={() => {
                  onAction("verify", user);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-slate-700"
              >
                <CheckCircle size={16} />
                Verify Farmer
              </button>
            )}
            <button
              onClick={() => {
                onAction("view", user);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700"
            >
              <Eye size={16} />
              View Details
            </button>
            {user.status !== "suspended" && (
              <button
                onClick={() => {
                  onAction("suspend", user);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-slate-700"
              >
                <Ban size={16} />
                {user.status === "pending" ? "Reject" : "Suspend"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// User Details Modal
const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl w-full max-w-md border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">User Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{user.name}</h4>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Status</p>
              <StatusBadge status={user.status} />
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Join Date</p>
              <p className="text-white font-medium">{user.joinDate}</p>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Location</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-white">{user.location}</span>
            </div>
          </div>

          {user.rating !== undefined && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Rating</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-white font-medium">
                  {user.rating > 0 ? user.rating : "No ratings yet"}
                </span>
              </div>
            </div>
          )}

          {user.livestockCount !== undefined && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Livestock Listed</p>
              <p className="text-white font-medium">{user.livestockCount} animals</p>
            </div>
          )}

          {user.totalOrders !== undefined && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Total Orders</p>
              <p className="text-white font-medium">{user.totalOrders} orders</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex gap-3">
          {user.status === "pending" && (
            <button
              onClick={() => {
                toast.success(`${user.name} has been verified!`);
                onClose();
              }}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Verify Farmer
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Table Row Component
const UserTableRow = ({ user, type, onAction }) => (
  <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-slate-300">
        <MapPin size={14} className="text-slate-500" />
        {user.location}
      </div>
    </td>
    <td className="px-4 py-3">
      <StatusBadge status={user.status} />
    </td>
    <td className="px-4 py-3">
      {type === "farmer" ? (
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={14} className="fill-amber-400" />
          <span className="text-white">{user.rating > 0 ? user.rating : "—"}</span>
        </div>
      ) : (
        <span className="text-white">{user.totalOrders}</span>
      )}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-slate-400 text-sm">
        <Calendar size={14} />
        {user.joinDate}
      </div>
    </td>
    <td className="px-4 py-3">
      <ActionMenu user={user} onAction={onAction} />
    </td>
  </tr>
);