import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BuyerNegotiationList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/bargain/sessions');
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      toast.error('Failed to load negotiations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'counter': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'counter': return <AlertCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-600 shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Negotiations</h1>
            <p className="text-gray-500 text-sm">Manage your active deals and offers</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Active Discussions</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {sessions.filter(n => n.status === 'pending' || n.status === 'counter').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Pending Payment</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">
            {sessions.filter(n => n.status === 'accepted' && !n.order_id).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Deals Closed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {sessions.filter(n => n.status === 'accepted' && n.order_id).length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'accepted', 'counter', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No negotiations found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Start negotiating by making an offer on a livestock item.'
              : `No ${filter} negotiations at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => navigate(`/dashboard/negotiations/${session.id}`)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 group"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-2 h-12 rounded-full ${
                    session.status === 'accepted' ? 'bg-green-500' : 
                    session.status === 'pending' || session.status === 'counter' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  
                  <div className="flex items-center gap-3">
                    {session.animal?.image_url && (
                      <img
                        src={session.animal.image_url}
                        alt={session.animal.species}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                        {session.animal?.breed || `Negotiation #${session.id}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Seller: Farmer • {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Price */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-1 ${
                      session.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      session.status === 'pending' || session.status === 'counter' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                    <p className="font-bold text-gray-800">
                      KES {session.final_price?.toLocaleString() || session.initial_offer?.toLocaleString()}
                    </p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-600 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerNegotiationList;
