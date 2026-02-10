import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Image as ImageIcon,
  DollarSign,
  Scale,
  Tag,
  FileText,
  CheckCircle,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AddLivestock = () => {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    species: "",
    breed: "",
    age: "",
    ageUnit: "years",
    weight: "",
    price: "",
    description: "",
    gender: "male",
    health_history: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(["Cow", "Goat", "Sheep", "Chicken", "Pig"]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove image
  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.species || !formData.breed || !formData.price || !imageFile) {
      toast.error("Please fill in all required fields and upload an image");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const data = new FormData();
      data.append("species", formData.species);
      data.append("breed", formData.breed);
      data.append("age", formData.age);
      data.append("ageUnit", formData.ageUnit);
      data.append("weight", formData.weight);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("gender", formData.gender);
      data.append("health_history", formData.health_history);
      data.append("image", imageFile);

      // API call
      await api.post("/livestock/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Livestock listed successfully!");
      navigate("/farmer-dashboard/inventory");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload livestock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add New Livestock</h1>
        <p className="text-slate-500">
          Fill in the details and add a photo of your animal
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE: Data Form */}
          <div className="space-y-6">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Breed Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Breed <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="e.g., Fresian, Boer, Dorper"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>

            {/* Age & Weight Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                  <select
                    name="ageUnit"
                    value={formData.ageUnit}
                    onChange={handleInputChange}
                    className="w-24 px-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weight <span className="text-slate-400">(kg)</span>
                </label>
                <div className="relative">
                  <Scale
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price <span className="text-red-500">*</span>{" "}
                <span className="text-slate-400">(KES)</span>
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              <div className="flex gap-4">
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

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your animal (appearance, characteristics, etc.)"
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Health History */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Health Notes / History
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <textarea
                  name="health_history"
                  value={formData.health_history}
                  onChange={handleInputChange}
                  placeholder="Vaccinations, illnesses, special care instructions..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Image Preview */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Animal Photo <span className="text-red-500">*</span>
              </h3>

              {/* Dashed Upload Box */}
              <div className="relative">
                {!previewUrl ? (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="text-green-600" size={32} />
                      </div>
                      <p className="text-lg font-medium text-slate-700 mb-2">
                        Click to Upload Image
                      </p>
                      <p className="text-sm text-slate-500">
                        PNG, JPG up to 5MB
                      </p>
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
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-80 object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={18} />
                    </button>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <ImageIcon size={16} />
                      <span>{imageFile?.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-medium text-slate-900">
                    {formData.species || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Breed</span>
                  <span className="font-medium text-slate-900">
                    {formData.breed || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price</span>
                  <span className="font-bold text-green-600">
                    KES{" "}
                    {formData.price
                      ? parseFloat(formData.price).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Photo</span>
                  <span
                    className={`font-medium ${previewUrl ? "text-green-600" : "text-red-500"}`}
                  >
                    {previewUrl ? "Uploaded" : "Required"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !previewUrl}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                loading || !previewUrl
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 active:scale-98"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle size={24} />
                  List Livestock
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLivestock;
