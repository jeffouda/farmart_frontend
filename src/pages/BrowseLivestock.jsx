import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Heart, MapPin, Star } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

function BrowseAnimals() {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [healthVerifiedOnly, setHealthVerifiedOnly] = useState(false);

  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API_BASE_URL}/livestock`, {
          params: {
            search: searchQuery || undefined,
            types: selectedTypes.length ? selectedTypes.join(",") : undefined,
            locations: selectedLocations.length
              ? selectedLocations.join(",")
              : undefined,
            min_price: priceRange.min || undefined,
            max_price: priceRange.max || undefined,
            verified: healthVerifiedOnly || undefined,
          },
        });

        /**
         * ✅ NORMALIZE RESPONSE
         * Supports:
         * - []
         * - { livestock: [] }
         * - { data: [] }
         */
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.livestock)
            ? res.data.livestock
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];

        setLivestock(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load livestock from server");
        setLivestock([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, [
    searchQuery,
    selectedTypes,
    selectedLocations,
    priceRange,
    healthVerifiedOnly,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
        Loading livestock...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-black uppercase italic">
            Browse Livestock
          </h1>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search livestock..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {livestock.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center">
            <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-4" />
            <h3 className="font-bold">No livestock found</h3>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {livestock.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full">
                    <Heart size={18} />
                  </button>

                  {item.verified && (
                    <span className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold">{item.title}</h3>

                  <p className="text-xl font-black text-orange-500">
                    KES {Number(item.price || 0).toLocaleString()}
                  </p>

                  <p className="text-xs text-slate-400 mb-3">
                    {item.breed} • {item.weight} • {item.age}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">
                      {item.farmer?.avatar || "F"}
                    </div>
                    <span className="text-xs">
                      {item.farmer?.name || "Unknown Farmer"}
                    </span>

                    <div className="ml-auto flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">
                        {item.rating || "0.0"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                    <MapPin size={12} />
                    {item.location}
                  </div>

                  <Link
                    to={`/livestock/${item.id}`}
                    className="block w-full text-center py-3 bg-orange-400 hover:bg-orange-500 text-white font-black rounded-xl text-xs uppercase"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseAnimals;
