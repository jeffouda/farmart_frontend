import React from "react";
import { Search, Edit3, Trash2 } from "lucide-react";

const InventoryCard = ({ breed, type, age, weight, price, status, image }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-4">
    <div className="relative rounded-2xl overflow-hidden mb-4">
      <img src={image} alt={breed} className="w-full h-48 object-cover" />
      <span className="absolute top-3 right-3 bg-[#D1FAE5] text-[#065F46] text-[10px] font-black px-3 py-1 rounded-full uppercase">
        {status}
      </span>
    </div>
    <div className="space-y-4 px-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-slate-900">{breed}</h3>
          <p className="text-slate-400 text-xs font-bold">{type}</p>
        </div>
        <p className="text-[#34A832] font-black text-lg whitespace-nowrap">
          KES {price}
        </p>
      </div>

      <div className="space-y-1 py-4 border-y border-slate-50">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">
            Age :
          </span>
          <span className="text-slate-900">{age}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">
            Weight :
          </span>
          <span className="text-slate-900">{weight}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-tighter">
            Vaccination :
          </span>
          <span className="text-slate-900">Complete</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors">
          <Edit3 size={14} /> Edit
        </button>
        <button className="bg-pink-50 hover:bg-pink-100 text-pink-600 p-3 rounded-xl transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

const FarmerInventory = () => {
  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">
        Livestock Inventory
      </h1>
      <p className="text-slate-400 text-sm mb-8 font-medium">
        Manage your livestock listings
      </p>

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
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34A832]/20"
          />
        </div>
        <select className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none">
          <option>All Categories</option>
        </select>
        <select className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none">
          <option>All Status</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InventoryCard
          breed="Friesian"
          type="Cattle"
          age="24 months"
          weight="450 kg"
          price="85,000"
          status="available"
          image="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800"
        />
        <InventoryCard
          breed="Boer"
          type="Goat"
          age="12 months"
          weight="45 kg"
          price="15,000"
          status="available"
          image="https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800"
        />
        <InventoryCard
          breed="Dorper"
          type="Sheep"
          age="18 months"
          weight="60 kg"
          price="18,000"
          status="available"
          image="https://images.unsplash.com/photo-1484557918186-7b4e571d4b12?auto=format&fit=crop&q=80&w=800"
        />
      </div>
    </div>
  );
};

export default FarmerInventory;
