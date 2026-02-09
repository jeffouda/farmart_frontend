import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Heart, MapPin, Star } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

function BrowseLivestock() {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/livestock`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.livestock || res.data?.data || [];

        setLivestock(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load livestock");
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading livestock...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4 items-center">
          <h1 className="text-2xl font-black uppercase italic">
            Browse Livestock
          </h1>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search livestock..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {livestock.length === 0 ? (
          <p className="text-center text-gray-500">No livestock found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {livestock.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.title}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />

                <div className="p-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-orange-500 font-black">KES {item.price}</p>

                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <MapPin size={12} className="mr-1" />
                    {item.location}
                  </div>

                  <Link
                    to={`/livestock/${item.id}`}
                    className="block mt-4 text-center py-2 bg-orange-400 text-white rounded-xl font-bold"
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

export default BrowseLivestock;
