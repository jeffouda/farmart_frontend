import React, { useState, useEffect } from "react";
import { Search, Edit3, Trash2, Plus, X, Upload, Image as ImageIcon, DollarSign, Scale, Tag } from "lucide-react";
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
      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
        animal.status === 'available' 
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
          <span className="text-slate-400 uppercase tracking-tighter">Age :</span>
          <span className="text-slate-900">{animal.age || '-'} months</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">Weight :</span>
          <span className="text-slate-900">{animal.weight || '-'} kg</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">Gender :</span>
          <span className="text-slate-900 capitalize">{animal.gender || '-'}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(animal)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
        >
          <Edit3 size={14} /> Edit
        </button>
        <button 
          onClick={() => onDelete(animal.id)}
          className="bg-pink-50 hover:bg-pink-100 text-pink-600 p-3 rounded-xl transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

const AddEditModal = ({ animal, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    species: animal?.species || "",
    breed: animal?.breed || "",
    age: animal?.age?.toString() || "",
    weight: animal?.weight?.toString() || "",
    price: animal?.price?.toString() || "",
    gender: animal?.gender || "male",
    health_history: animal?.health_history || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(animal?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(["Cow", "Goat", "Sheep", "Chicken", "Pig"]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.species || !formData.breed || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("species", formData.species);
      data.append("breed", formData.breed);
      data.append("age", formData.age);
      data.append("weight", formData.weight);
      data.append("price", formData.price);
      data.append("gender", formData.gender);
      data.append("health_history", formData.health_history);
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (animal?.id) {
        // Update existing animal
        await api.put(`/livestock/${animal.id}`, {
          price: formData.price,
          status: animal.status,
        });
        toast.success("Animal updated successfully");
      } else {
        // Create new animal
        await api.post("/livestock/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Livestock added successfully");
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving animal:', error);
      toast.error(error.response?.data?.error || "Failed to save livestock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">
            {animal ? 'Edit Animal' : 'Add New Livestock'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Species */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Breed <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="e.g., Fresian, Boer"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age (months)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (KES) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <div className="flex gap-4 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-slate-700">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-slate-700">Female</span>
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Photo</label>
            <div className="relative">
              {!previewUrl ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-green-500 hover:bg-green-50 transition-all">
                    <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-slate-600 font-medium">Click to upload image</p>
                    <p className="text-slate-400 text-sm">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Health History */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Health Notes</label>
            <textarea
              name="health_history"
              value={formData.health_history}
              onChange={handleInputChange}
              placeholder="Vaccinations, illnesses, special care..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                loading 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#34A832] text-white hover:bg-[#2D8E2B]"
              }`}
            >
              {loading ? "Saving..." : (animal ? "Update" : "Add Livestock")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FarmerInventory = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);

  const fetchAnimals = async () => {
    try {
      const response = await api.get('/livestock/my-inventory');
      setAnimals(response.data.animals || []);
    } catch (error) {
      console.error('Failed to fetch animals:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleDelete = async (animalId) => {
    if (!window.confirm('Are you sure you want to delete this animal?')) return;
    
    try {
      await api.delete(`/livestock/${animalId}`);
      toast.success('Animal deleted successfully');
      fetchAnimals();
    } catch (error) {
      console.error('Failed to delete animal:', error);
      toast.error(error.response?.data?.error || 'Failed to delete animal');
    }
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditingAnimal(null);
    fetchAnimals();
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = 
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.species?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || animal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Livestock Inventory</h1>
          <p className="text-slate-400 text-sm font-medium">Manage your livestock listings</p>
        </div>
        <button
          onClick={() => {
            setEditingAnimal(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white px-4 py-3 rounded-xl font-bold shadow-md transition-all"
        >
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
          className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none"
        >
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
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-4 animate-pulse">
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
          <h3 className="text-xl font-bold text-slate-700 mb-2">No animals found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Start by adding your first livestock"}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white px-6 py-3 rounded-xl font-bold"
          >
            <Plus size={18} /> Add Livestock
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddEditModal
          animal={editingAnimal}
          onClose={() => {
            setShowModal(false);
            setEditingAnimal(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default FarmerInventory;

