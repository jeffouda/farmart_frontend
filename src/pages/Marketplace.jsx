<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> origin
import { Search, Filter, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  optimisticRemoveFromWishlist,
} from "../redux/wishlistSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
<<<<<<< HEAD
=======
import LivestockCard from "../components/LivestockCard"; 
>>>>>>> origin

const ANIMAL_TYPES = ["Cattle", "Goats", "Sheep", "Chicken", "Pig"];
const LOCATIONS = [
  "Nairobi City",
  "Kiambu",
  "Nakuru",
  "Kisumu",
  "Eldoret",
  "Mombasa",
  "Narok",
  "Kajiado",
  "Thika",
  "Machakos",
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

function Marketplace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // State
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch livestock from API
  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true);
        setError(null);

<<<<<<< HEAD
        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategories.length > 0)
          params.append("species", selectedCategories.join(","));
        if (priceRange.min) params.append("min_price", priceRange.min);
        if (priceRange.max) params.append("max_price", priceRange.max);
        if (selectedLocation) params.append("location", selectedLocation);
        params.append("sort", sortBy);

        const response = await api.get(`/livestock?${params.toString()}`);
        setLivestock(response.data.animals || response.data || []);
      } catch (error) {
        console.error("Failed to fetch livestock:", error);
        setError("Failed to load livestock. Please try again.");
=======
        // Build clean params object for Axios
        const params = {
          sort: sortBy,
          ...(searchQuery && { search: searchQuery }),
          ...(selectedCategories.length > 0 && {
            species: selectedCategories.join(","),
          }),
          ...(priceRange.min && { min_price: priceRange.min }),
          ...(priceRange.max && { max_price: priceRange.max }),
          ...(selectedLocation && { location: selectedLocation }),
        };

        // Note: '/livestock' maps to @livestock_bp.route("/")
        const response = await api.get("/livestock", { params });

        // Handle different data structures from Flask
        const data = response.data.animals || response.data;
        setLivestock(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch livestock:", err);
        if (err.response?.status === 403) {
          setError(
            "Access Denied (403). Ensure you are logged in or check ngrok headers.",
          );
        } else {
          setError("Failed to load livestock. Please try again.");
        }
>>>>>>> origin
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, [searchQuery, selectedCategories, priceRange, selectedLocation, sortBy]);

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlistItems.some(
      (item) =>
        String(item.animal?.id) === String(id) ||
        String(item.animal_id) === String(id),
    );
  };

  const handleAddToCart = (id) => {
    if (!currentUser) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }

    const item = livestock.find((l) => String(l.id) === String(id));
    if (item) {
      dispatch(
        addToCart({
          id: item.id,
          name: `${item.species} - ${item.breed}`,
          price: item.price,
          image: item.image_url || item.image,
        }),
      );
      toast.success("Added to cart!");
    }
  };

  const handleToggleWishlist = (id) => {
    if (!currentUser) {
      toast.error("Please login to save items");
      navigate("/auth");
      return;
    }

    if (isInWishlist(id)) {
      dispatch(optimisticRemoveFromWishlist(id));
      dispatch(removeFromWishlist(id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(id));
      toast.success("Added to wishlist!");
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setSelectedLocation("");
    setSortBy("newest");
  };

<<<<<<< HEAD
  // Has active filters
=======
>>>>>>> origin
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange.min ||
    priceRange.max ||
    selectedLocation;

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search livestock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg">
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl p-5 shadow-sm sticky top-36">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-700">
                  Clear All
                </button>
              )}
            </div>

<<<<<<< HEAD
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
=======
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Category</h3>
                {ANIMAL_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 mb-2 cursor-pointer">
>>>>>>> origin
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(type)}
                      onChange={() => handleCategoryToggle(type)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm text-slate-600">{type}</span>
                  </label>
                ))}
              </div>

<<<<<<< HEAD
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Price Range (KES)
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
=======
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Price Range (KES)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="w-full px-2 py-1.5 bg-gray-50 border rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full px-2 py-1.5 bg-gray-50 border rounded text-sm"
                  />
                </div>
>>>>>>> origin
              </div>

<<<<<<< HEAD
            {/* Location Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Location
              </h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
=======
              <div>
                <h3 className="text-sm font-semibold mb-3">Location</h3>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 bg-gray-50 border rounded text-sm">
                  <option value="">All Locations</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 bg-gray-50 border rounded text-sm">
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
>>>>>>> origin
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
<<<<<<< HEAD
          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {livestock.length}
              </span>{" "}
              animals
            </p>
          </div>

          {/* Loading State */}
          {loading && (
=======
          {loading ? (
>>>>>>> origin
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg">
                Try Again
              </button>
            </div>
          ) : livestock.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
<<<<<<< HEAD
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No animals found matching your filters
              </h3>
              <p className="text-slate-500 mb-4">
                Try adjusting your filters or search query
              </p>
=======
              <h3 className="text-lg font-semibold mb-2">No animals found</h3>
>>>>>>> origin
              <button
                onClick={clearFilters}
                className="text-green-600 font-medium">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {livestock.map((animal) => (
                <div
                  key={animal.id}
<<<<<<< HEAD
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/livestock/${animal.id}`)}
                >
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={
                        animal.image_url || animal.image || "/placeholder.jpg"
                      }
                      alt={animal.breed}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">
                      {animal.breed}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">
                      {animal.species}
                    </p>
                    {animal.location && (
                      <p className="text-xs text-slate-400 mb-2">
                        {animal.location}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      {animal.age && <span>Age: {animal.age}</span>}
                      {animal.weight && <span>Weight: {animal.weight}kg</span>}
                    </div>
                    <p className="text-green-600 font-bold text-lg mb-3">
                      KSh {Number(animal.price).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(animal);
                        }}
                        className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(animal);
                        }}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
=======
                  animal={animal}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isInWishlist(animal.id)}
                />
>>>>>>> origin
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters (Simplified) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-80 bg-white h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <X
                onClick={() => setMobileFiltersOpen(false)}
<<<<<<< HEAD
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(type)}
                      onChange={() => handleCategoryToggle(type)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600"
                    />
                    <span className="text-sm text-slate-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Price Range (KES)
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Location
              </h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 bg-gray-100 text-slate-700 rounded-lg font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Apply
              </button>
=======
                className="cursor-pointer"
              />
>>>>>>> origin
            </div>
            {/* ... Repeat Filter UI for mobile ... */}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 bg-green-600 text-white rounded-lg mt-4">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
