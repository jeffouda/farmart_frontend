import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Clock, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BuyerNegotiationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, [id]);

  const fetchSession = async () => {
    try {
      const response = await api.get(`/bargain/sessions/${id}`);
      setSession(response.data.session);
      setMessages(response.data.session?.messages || []);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      toast.error('Failed to load negotiation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await api.post(`/bargain/sessions/${id}/messages`, {
        message: newMessage,
        sender_id: currentUser.id,
        sender_type: currentUser.role
      });
      setNewMessage('');
      fetchSession();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      await api.put(`/bargain/sessions/${id}/accept`);
      toast.success('Offer accepted!');
      fetchSession();
    } catch (error) {
      console.error('Failed to accept offer:', error);
      toast.error('Failed to accept offer');
    }
  };

  const handleCounterOffer = async () => {
    const amount = prompt('Enter counter offer amount (KES):');
    if (!amount) return;

    try {
      await api.post(`/bargain/sessions/${id}/counter`, {
        amount: parseFloat(amount),
        message: 'Counter offer'
      });
      toast.success('Counter offer sent!');
      fetchSession();
    } catch (error) {
      console.error('Failed to send counter offer:', error);
      toast.error('Failed to send counter offer');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this offer?')) return;
    
    try {
      await api.put(`/bargain/sessions/${id}/reject`);
      toast.success('Offer rejected');
      fetchSession();
    } catch (error) {
      console.error('Failed to reject offer:', error);
      toast.error('Failed to reject offer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Negotiation not found</p>
        <button
          onClick={() => navigate('/dashboard/negotiations')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Back to Negotiations
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      counter: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800'
    };
    return colors[session.status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/negotiations')}
          className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">
            {session.animal?.breed || `Negotiation #${session.id}`}
          </h1>
          <p className="text-sm text-gray-500">
            {session.animal?.species} • Seller: {session.animal?.farmer_name}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
          {session.status.toUpperCase()}
        </span>
      </div>

      {/* Price Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Original Price</p>
            <p className="text-lg font-semibold text-gray-800 line-through">
              KES {session.original_price?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Offer</p>
            <p className="text-2xl font-bold text-green-600">
              KES {session.current_price?.toLocaleString() || session.final_price?.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        {session.status !== 'accepted' && session.status !== 'rejected' && session.status !== 'completed' && (
          <div className="flex gap-3 mt-6 pt-6 border-t">
            {session.status === 'counter' && (
              <>
                <button
                  onClick={handleAcceptOffer}
                  className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Accept Offer
                </button>
                <button
                  onClick={handleCounterOffer}
                  className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign size={18} />
                  Counter Offer
                </button>
                <button
                  onClick={handleReject}
                  className="py-3 px-4 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
          </div>
        )}
        
        {session.status === 'accepted' && (
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => navigate(`/checkout/${session.order_id}`)}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Conversation</h2>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender_type === 'buyer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-xl p-4 ${
                  msg.sender_type === 'buyer'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerNegotiationRoom;
