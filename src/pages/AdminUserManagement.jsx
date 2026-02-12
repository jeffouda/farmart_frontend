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
import axios from "../api/axios";

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
const ActionMenu = ({ user, onAction, isFarmer }) => {
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
            {isFarmer && user.status === "pending" && (
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
            {user.status !== "suspended" ? (
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
            ) : (
              <button
                onClick={() => {
                  onAction("activate", user);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-slate-700"
              >
                <CheckCircle size={16} />
                Activate
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// User Details Modal
const UserDetailsModal = ({ user, onClose, isFarmer }) => {
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
              {user.name ? user.name.charAt(0) : "?"}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{user.name || "Unknown"}</h4>
              <p className="text-slate-400 text-sm">{user.email || "No email"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Status</p>
              <StatusBadge status={user.status} />
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Join Date</p>
              <p className="text-white font-medium">{user.joinDate || "Unknown"}</p>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Location</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-white">{user.location || "Unknown"}</span>
            </div>
          </div>

          {isFarmer && (
            <>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs">Phone</p>
                <p className="text-white font-medium">{user.phone_number || "Not provided"}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs">Rating</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-medium">
                    {user.rating > 0 ? user.rating.toFixed(1) : "No ratings yet"}
                  </span>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs">Livestock Listed</p>
                <p className="text-white font-medium">{user.livestockCount || 0} animals</p>
              </div>
            </>
          )}

          {!isFarmer && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Total Orders</p>
              <p className="text-white font-medium">{user.totalOrders || 0} orders</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex gap-3">
          {isFarmer && user.status === "pending" && (
            <button
              onClick={() => {
                onAction("verify", user);
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
          {user.name ? user.name.charAt(0) : "?"}
        </div>
        <div>
          <p className="text-white font-medium">{user.name || "Unknown"}</p>
          <p className="text-slate-400 text-sm">{user.email || "No email"}</p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-slate-300">
        <MapPin size={14} className="text-slate-500" />
        {user.location || "Unknown"}
      </div>
    </td>
    <td className="px-4 py-3">
      <StatusBadge status={user.status} />
    </td>
    <td className="px-4 py-3">
      {type === "farmer" ? (
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={14} className="fill-amber-400" />
          <span className="text-white">{user.rating > 0 ? user.rating.toFixed(1) : "—"}</span>
        </div>
      ) : (
        <span className="text-white">{user.totalOrders || 0}</span>
      )}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-slate-400 text-sm">
        <Calendar size={14} />
        {user.joinDate || "Unknown"}
      </div>
    </td>
    <td className="px-4 py-3">
      <ActionMenu user={user} onAction={onAction} isFarmer={type === "farmer"} />
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
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);
  
  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch farmers
        const farmersRes = await axios.get("/admin/farmers");
        setFarmers(farmersRes.data);
        
        // Fetch buyers
        const buyersRes = await axios.get("/admin/buyers");
        setBuyers(buyersRes.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users from backend");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle tab click - navigate to appropriate URL
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === "buyers" ? "/admin/buyers" : "/admin/farmers");
  };
  
  // Filter users based on search and status
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      (farmer.name && farmer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (farmer.email && farmer.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || farmer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      (buyer.name && buyer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (buyer.email && buyer.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || buyer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  // Handle actions (verify, suspend, activate)
  const handleAction = async (action, user) => {
    const userId = user.user_id || user.id;
    let endpoint;
    
    // For farmers, use the farmers endpoint for verify
    if (action === "verify" && activeTab === "farmers") {
      endpoint = `/admin/farmers/${userId}/verify`;
    } else {
      endpoint = `/admin/users/${userId}/${action}`;
    }
    
    try {
      switch (action) {
        case "verify":
          await axios.post(endpoint);
          toast.success(`${user.name} has been verified successfully!`);
          // Refresh data
          const farmersRes = await axios.get("/admin/farmers");
          setFarmers(farmersRes.data);
          break;
        case "suspend":
          await axios.post(endpoint);
          toast.success(`${user.name} has been suspended`);
          // Refresh data
          if (activeTab === "farmers") {
            const farmersRes = await axios.get("/admin/farmers");
            setFarmers(farmersRes.data);
          } else {
            const buyersRes = await axios.get("/admin/buyers");
            setBuyers(buyersRes.data);
          }
          break;
        case "activate":
          await axios.post(endpoint);
          toast.success(`${user.name} has been activated`);
          // Refresh data
          if (activeTab === "farmers") {
            const farmersRes = await axios.get("/admin/farmers");
            setFarmers(farmersRes.data);
          } else {
            const buyersRes = await axios.get("/admin/buyers");
            setBuyers(buyersRes.data);
          }
          break;
        case "view":
          setSelectedUser(user);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Action failed");
    }
  };
  
  // Count pending farmers
  const pendingCount = farmers.filter((f) => f.status === "pending").length;
  
  const currentUsers = activeTab === "farmers" ? filteredFarmers : filteredBuyers;
  
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
  
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Loading users...</p>
        </div>
      ) : (
        /* Table */
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
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      type={activeTab === "farmers" ? "farmer" : "buyer"}
                      onAction={handleAction}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <p className="text-slate-400">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
          {/* Empty State */}
          {currentUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-400">No users found matching your criteria</p>
            </div>
          )}
        </div>
      )}
  
      {/* User Details Modal */}
      <UserDetailsModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        isFarmer={activeTab === "farmers"}
      />
    </div>
  );
};

export default AdminUserManagement;