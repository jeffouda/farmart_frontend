import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, MapPin, Filter, Star } from "lucide-react";

// Mock Data - Kenyan Livestock Listings
const MOCK_LIVESTOCK = [
  {
    id: 1,
    title: "Boran Bull - Premium",
    price: 185000,
    location: "Nakuru",
    type: "Cow",
    breed: "Boran",
    weight: "450kg",
    age: "3 years",
    image: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80",
    farmer: { name: "John Kamau", avatar: "JK" },
    rating: 4.8,
    verified: true,
  },
  {
    id: 2,
    title: "Boer Goat - Doe",
    price: 28000,
    location: "Kiambu",
    type: "Goat",
    breed: "Boer",
    weight: "35kg",
    age: "1.5 years",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Mary Wanjiku", avatar: "MW" },
    rating: 4.5,
    verified: true,
  },
  {
    id: 3,
    title: "Sahiwal Heifer",
    price: 165000,
    location: "Narok",
    type: "Cow",
    breed: "Sahiwal",
    weight: "380kg",
    age: "2.5 years",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80",
    farmer: { name: "Samuel Ole", avatar: "SO" },
    rating: 4.9,
    verified: true,
  },
  {
    id: 4,
    title: "Dorper Ram",
    price: 32000,
    location: "Kajiado",
    type: "Sheep",
    breed: "Dorper",
    weight: "45kg",
    age: "1 year",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Paul Mutua", avatar: "PM" },
    rating: 4.6,
    verified: true,
  },
  {
    id: 5,
    title: "Kienyenji Chicken - Layers",
    price: 3500,
    location: "Nairobi",
    type: "Chicken",
    breed: "Kienyenji",
    weight: "2kg",
    age: "8 months",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80",
    farmer: { name: "Grace Achieng", avatar: "GA" },
    rating: 4.3,
    verified: true,
  },
  {
    id: 6,
    title: "Large White Pig - Sow",
    price: 45000,
    location: "Eldoret",
    type: "Pig",
    breed: "Large White",
    weight: "120kg",
    age: "1.5 years",
    image: "https://images.unsplash.com/photo-1604842247038-08c761d7a4d2?auto=format&fit=crop&q=80",
    farmer: { name: "Robert Kiprop", avatar: "RK" },
    rating: 4.7,
    verified: true,
  },
  {
    id: 7,
    title: "Ankole Bull - Breeding",
    price: 220000,
    location: "Kisumu",
    type: "Cow",
    breed: "Ankole",
    weight: "520kg",
    age: "4 years",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80",
    farmer: { name: "Daniel Ochieng", avatar: "DO" },
    rating: 4.9,
    verified: true,
  },
  {
    id: 8,
    title: "Galla Goat - Buck",
    price: 25000,
    location: "Marsabit",
    type: "Goat",
    breed: "Galla",
    weight: "40kg",
    age: "2 years",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Hassan Adan", avatar: "HA" },
    rating: 4.4,
    verified: true,
  },
];

const ANIMAL_TYPES = ["Cow", "Goat", "Sheep", "Chicken", "Pig"];
const LOCATIONS = ["Nakuru", "Kiambu", "Narok", "Kajiado", "Nairobi", "Eldoret", "Kisumu", "Marsabit"];

function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [healthVerifiedOnly, setHealthVerifiedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLocationToggle = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const filteredLivestock = MOCK_LIVESTOCK.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);
    const matchesMinPrice = !priceRange.min || item.price >= parseInt(priceRange.min);
    const matchesMaxPrice = !priceRange.max || item.price <= parseInt(priceRange.max);
    const matchesVerified = !healthVerifiedOnly || item.verified;
    return matchesSearch && matchesType && matchesLocation && matchesMinPrice && matchesMaxPrice && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Marketplace
            </h1>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search livestock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-700">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-36">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 uppercase italic">Filters</h2>
              {(selectedTypes.length > 0 || selectedLocations.length > 0 || healthVerifiedOnly) && (
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedLocations([]);
                    setPriceRange({ min: "", max: "" });
                    setHealthVerifiedOnly(false);
                  }}
                  className="text-xs font-bold text-green-600 uppercase tracking-wider hover:text-green-500">
                  Clear All
                </button>
              )}
            </div>

            {/* Animal Types */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Animal Type</h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Location</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {LOCATIONS.map((location) => (
                  <label key={location} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Health Verified Toggle */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-700">Health Verified Only</span>
                <button
                  onClick={() => setHealthVerifiedOnly(!healthVerifiedOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    healthVerifiedOnly ? "bg-green-600" : "bg-slate-200"
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      healthVerifiedOnly ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="font-bold text-slate-900">{filteredLivestock.length}</span> livestock
            </p>
          </div>

          {filteredLivestock.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No livestock found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLivestock.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors">
                      <Heart size={18} />
                    </button>
                    {item.verified && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg">
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-xl font-black text-orange-500 mb-2">
                      KES {item.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      {item.breed} • {item.weight} • {item.age}
                    </p>

                    {/* Farmer Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700">
                        {item.farmer.avatar}
                      </div>
                      <span className="text-xs font-medium text-slate-600">{item.farmer.name}</span>
                      <div className="flex items-center gap-1 ml-auto text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{item.rating}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>

                    {/* View Details Button */}
                    <Link
                      to="/livestock/1"
                      className="block w-full py-3 text-center bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-black uppercase text-xs tracking-wider rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all active:scale-95">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 uppercase italic">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-slate-400">
                ✕
              </button>
            </div>

            {/* Animal Types */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Animal Type</h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600"
                    />
                    <span className="text-sm font-medium text-slate-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Location</h3>
              <div className="space-y-2">
                {LOCATIONS.map((location) => (
                  <label key={location} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600"
                    />
                    <span className="text-sm font-medium text-slate-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Health Verified */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-700">Health Verified Only</span>
                <button
                  onClick={() => setHealthVerifiedOnly(!healthVerifiedOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    healthVerifiedOnly ? "bg-green-600" : "bg-slate-200"
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      healthVerifiedOnly ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </label>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
