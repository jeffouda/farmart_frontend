import React, { useState, useEffect } from "react";
import { Search, Edit3, Trash2, Plus } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const InventoryCard = ({ animal, onEdit, onDelete }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-4">
    <div className="relative rounded-2xl overflow-hidden mb-4">
      <img
        src={animal.image_url || "https://placehold.co/600x400?text=No+Image"}
        alt={animal.breed}
        className="w-full h-48 object-cover"
      />
      <span
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
          animal.status === "available"
            ? "bg-[#D1FAE5] text-[#065F46]"
            : "bg-amber-100 text-amber-700"
        }`}>
        {animal.status}
      </span>
    </div>
    <div className="space-y-4 px-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-slate-900">{animal.breed}</h3>
          <p className="text-slate-400 text-xs font-bold">{animal.species}</p>
        </div>
        <p className="text-[#34A832] font-black text-lg whitespace-nowrap">
          KES {parseFloat(animal.price || 0).toLocaleString()}
        </p>
      </div>

      <div className="space-y-1 py-4 border-y border-slate-50">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">
            Age :
          </span>
          <span className="text-slate-900">{animal.age || "-"} months</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">
            Weight :
          </span>
          <span className="text-slate-900">{animal.weight || "-"} kg</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">
            Gender :
          </span>
          <span className="text-slate-900 capitalize">
            {animal.gender || "-"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(animal)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors">
          <Edit3 size={14} /> Edit
        </button>
        <button
          onClick={() => onDelete(animal.id)}
          className="bg-pink-50 hover:bg-pink-100 text-pink-600 p-3 rounded-xl transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

const FarmerInventory = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);

  const fetchAnimals = async () => {
    try {
      const response = await api.get("/livestock/list");
      setAnimals(response.data.animals || []);
    } catch (error) {
      console.error("Failed to fetch animals:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleDelete = async (animalId) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;

    try {
      await api.delete(`/livestock/${animalId}`);
      toast.success("Animal deleted successfully");
      fetchAnimals();
    } catch (error) {
      console.error("Failed to delete animal:", error);
      toast.error(error.response?.data?.error || "Failed to delete animal");
    }
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setShowAddModal(true);
  };

  // Filter animals based on search and status
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.species?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || animal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Livestock Inventory
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Manage your livestock listings
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAnimal(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white px-4 py-3 rounded-xl font-bold shadow-md transition-all">
          <Plus size={18} /> Add Livestock
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by breed or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none">
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-4 animate-pulse">
              <div className="w-full h-48 bg-slate-200 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAnimals.map((animal) => (
            <InventoryCard
              key={animal.id}
              animal={animal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <div className="mb-4">
            <Search size={48} className="mx-auto text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No animals found
          </h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Start by adding your first livestock"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white px-6 py-3 rounded-xl font-bold">
            <Plus size={18} /> Add Livestock
          </button>
        </div>
      )}

      {/* Add/Edit Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              {editingAnimal ? "Edit Animal" : "Add New Livestock"}
            </h2>
            <p className="text-slate-500 mb-4">
              Animal creation form would go here. Connect to the livestock
              creation endpoint.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAnimal(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAnimal(null);
                  fetchAnimals();
                }}
                className="px-4 py-2 bg-[#34A832] text-white rounded-xl font-bold">
                Save (Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerInventory;
