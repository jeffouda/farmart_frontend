import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Star, TrendingDown, Calendar, Loader2 } from "lucide-react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";

const AnalyticCard = ({ title, value, change, color, icon: Icon, loading }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm flex-1">
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
      <Icon size={20} />
    </div>
    <p className="text-slate-500 text-sm font-bold">{title}</p>
    {loading ? (
      <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-1" />
    ) : (
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    )}
    {change && (
      <p className={`text-xs mt-1 font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change.startsWith('+') ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
        {change} vs last period
      </p>
    )}
  </div>
);

