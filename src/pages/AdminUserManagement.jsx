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

const AdminUserManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Sync active tab with URL path
  const getActiveTabFromPath = () => {
    if (location.pathname.includes("/buyers")) return "buyers";
    return "farmers";
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);
  
  // Handle tab click - navigate to appropriate URL
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === "buyers" ? "/admin/buyers" : "/admin/farmers");
  };

  // Filter users based on search and status
  const filteredFarmers = mockFarmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || farmer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredBuyers = mockBuyers.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || buyer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle actions
  const handleAction = (action, user) => {
    switch (action) {
      case "verify":
        toast.success(`${user.name} has been verified successfully!`);
        break;
      case "suspend":
        toast.success(`${user.name} has been ${user.status === "pending" ? "rejected" : "suspended"}`);
        break;
      case "view":
        setSelectedUser(user);
        break;
      default:
        break;
    }
  };

  // Count pending farmers
  const pendingCount = mockFarmers.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage farmers and buyers on the platform
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => handleTabClick("farmers")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "farmers"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Farmers
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-black text-xs px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabClick("buyers")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "buyers"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Buyers
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  {activeTab === "farmers" ? "Farmer" : "Buyer"}
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Location
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  {activeTab === "farmers" ? "Rating" : "Orders"}
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Join Date
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "farmers" ? filteredFarmers : filteredBuyers).map(
                (user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    type={activeTab === "farmers" ? "farmer" : "buyer"}
                    onAction={handleAction}
                  />
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(filteredFarmers.length === 0 || filteredBuyers.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-400">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default AdminUserManagement;
