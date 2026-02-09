import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Loader2,
  User,
  Mail,
  Calendar,
  ShoppingCart,
  Sprout
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Mock Data
const mockFarmers = [
  {
    id: 1,
    name: "John Kamau",
    email: "john@farm.com",
    farmName: "Kamau Family Farms",
    status: "pending",
    joinDate: "2024-01-15",
    livestockCount: 15,
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    email: "sarah@farm.com",
    farmName: "Wanjiku Organic Farm",
    status: "verified",
    joinDate: "2023-11-20",
    livestockCount: 28,
  },
  {
    id: 3,
    name: "Mike Ochieng",
    email: "mike@farm.com",
    farmName: "Ochieng Cattle Ranch",
    status: "suspended",
    joinDate: "2023-09-10",
    livestockCount: 8,
  },
];

const mockBuyers = [
  {
    id: 101,
    name: "Alice Johnson",
    email: "alice@email.com",
    status: "active",
    joinDate: "2023-12-01",
    ordersPlaced: 12,
  },
  {
    id: 102,
    name: "Bob Smith",
    email: "bob@email.com",
    status: "active",
    joinDate: "2024-01-10",
    ordersPlaced: 5,
  },
  {
    id: 103,
    name: "Carol Williams",
    email: "carol@email.com",
    status: "suspended",
    joinDate: "2023-06-15",
    ordersPlaced: 2,
  },
];

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    verified: "bg-green-500/20 text-green-400 border-green-500/30",
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    suspended: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.active
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Action Buttons Component
const ActionButtons = ({ user, userType, onAction }) => (
  <div className="flex items-center gap-2">
    {userType === "farmers" && user.status === "pending" && (
      <button
        onClick={() => onAction("approve", user)}
        className="p-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
        title="Approve Farmer"
      >
        <CheckCircle size={16} />
      </button>
    )}
    <button
      onClick={() => onAction("view", user)}
      className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
      title="View Details"
    >
      <Eye size={16} />
    </button>
    {user.status !== "suspended" && (
      <button
        onClick={() => onAction("suspend", user)}
        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
        title={userType === "farmers" ? "Reject/Suspend" : "Suspend"}
      >
        <Ban size={16} />
      </button>
    )}
  </div>
);

// Skeleton Loader
const SkeletonRow = () => (
  <tr>
    <td colSpan={userType === "farmers" ? 6 : 5} className="px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded animate-pulse w-1/4 mb-2" />
          <div className="h-3 bg-slate-700 rounded animate-pulse w-1/6" />
        </div>
      </div>
    </td>
  </tr>
);

// Table Header
const TableHeader = ({ userType }) => (
  <thead className="bg-slate-700/50">
    <tr>
      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
        {userType === "farmers" ? "Farmer" : "Buyer"}
      </th>
      {userType === "farmers" && (
        <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
          Farm Name
        </th>
      )}
      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
        Email
      </th>
      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
        Status
      </th>
      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
        {userType === "farmers" ? "Livestock" : "Orders"}
      </th>
      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
        Join Date
      </th>
      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
        Actions
      </th>
    </tr>
  </thead>
);

// Table Row
const UserTableRow = ({ user, userType, onAction }) => (
  <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-slate-400 text-sm">
            {userType === "farmers" ? "Farmer" : "Buyer"}
          </p>
        </div>
      </div>
    </td>
    {userType === "farmers" && (
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sprout size={14} className="text-slate-500" />
          {user.farmName}
        </div>
      </td>
    )}
    <td className="px-4 py-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Mail size={14} />
        {user.email}
      </div>
    </td>
    <td className="px-4 py-3">
      <StatusBadge status={user.status} />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1.5 text-slate-300">
        {userType === "farmers" ? (
          <>
            <User size={14} className="text-slate-500" />
            {user.livestockCount} animals
          </>
        ) : (
          <>
            <ShoppingCart size={14} className="text-slate-500" />
            {user.ordersPlaced} orders
          </>
        )}
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
        <Calendar size={14} />
        {user.joinDate}
      </div>
    </td>
    <td className="px-4 py-3">
      <ActionButtons user={user} userType={userType} onAction={onAction} />
    </td>
  </tr>
);

const AdminUsers = ({ userType: propUserType }) => {
  const location = useLocation();
  
  // Use prop if provided, otherwise fallback to URL detection
  const userType = propUserType || (location.pathname.includes("/buyers") ? "buyers" : "farmers");
  
  // Debug check: Add a console.log to verify the component is mounting
  console.log("AdminUsers Loaded:", userType);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Use mock data for now
        const mockData = userType === "farmers" ? mockFarmers : mockBuyers;
        setUsers(mockData);

        // In production:
        // const endpoint = userType === "farmers" ? "/admin/farmers" : "/admin/buyers";
        // const response = await api.get(endpoint);
        // setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error(`Failed to load ${userType}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userType]);

  // Handle actions
  const handleAction = async (action, user) => {
    switch (action) {
      case "approve":
        try {
          // In production:
          // await api.put(`/admin/farmers/${user.id}/verify`);

          setUsers((prev) =>
            prev.map((u) =>
              u.id === user.id ? { ...u, status: "verified" } : u
            )
          );
          toast.success(`${user.name} has been verified!`);
        } catch (error) {
          toast.error("Failed to verify farmer");
        }
        break;

      case "suspend":
        try {
          // In production:
          // await api.put(`/admin/users/${user.id}/suspend`);

          setUsers((prev) =>
            prev.map((u) =>
              u.id === user.id ? { ...u, status: "suspended" } : u
            )
          );
          toast.success(`${user.name} has been ${user.status === "pending" ? "rejected" : "suspended"}`);
        } catch (error) {
          toast.error("Failed to suspend user");
        }
        break;

      case "view":
        toast(`Viewing ${user.name}'s details`, { icon: "👁️" });
        break;

      default:
        break;
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Count stats
  const stats = {
    total: users.length,
    pending: users.filter((u) => u.status === "pending").length,
    verified: users.filter((u) => u.status === "verified" || u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">
            {userType} Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage {userType} accounts and verify registrations
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-slate-700 rounded-lg text-slate-300 text-sm">
            {stats.total} Total
          </span>
          {stats.pending > 0 && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
              {stats.pending} Pending
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total {userType}</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">{stats.verified}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Suspended</p>
          <p className="text-2xl font-bold text-red-400">{stats.suspended}</p>
        </div>
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
            placeholder={`Search ${userType} by name or email...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <TableHeader userType={userType} />
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={userType === "farmers" ? 6 : 5}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <User size={48} className="text-slate-600 mb-4" />
                      <p className="text-slate-400">
                        No {userType} found matching your criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    userType={userType}
                    onAction={handleAction}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <p>
            Showing {filteredUsers.length} of {users.length} {userType}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
