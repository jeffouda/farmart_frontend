import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Send, ArrowLeft, Image, Phone, Video } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

function Negotiation() {
  const { livestockId, receiverId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [livestock, setLivestock] = useState(null);
  const [receiverName, setReceiverName] = useState('Loading...');

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversation history
  const fetchMessages = async () => {
    try {
      const response = await api.get(/negotiation/${livestockId});
      setMessages(response.data.messages || []);
      setLivestock(response.data.livestock);
      setReceiverName(response.data.farmer_name || 'Farmer');
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };
   // Initial fetch and polling
  useEffect(() => {
    fetchMessages();

    // Poll every 3 seconds for new messages
    pollingRef.current = setInterval(fetchMessages, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [livestockId]);
 // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await api.post(/negotiation/${livestockId}, {
        content: newMessage.trim(),
        receiver_id: receiverId,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  // Format timestamp
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from current user
  const isMyMessage = (senderId) => {
    return currentUser && String(senderId) === String(currentUser.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - WhatsApp Style */}
      <div className="bg-green-600 text-white px-4 py-3 sticky top-16 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

                    {/* Livestock Thumbnail */}
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
            <img
              src={livestock?.image_url || 'https://placehold.co/100x100?text=Animal'}
              alt={livestock?.species || 'Livestock'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Price */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {livestock?.breed || ${livestock?.species} - ${receiverName}}
            </h3>
            <p className="text-xs text-green-100">
              Asking: KES {livestock?.price?.toLocaleString() || '0'}
            </p>
          </div>
 {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <Phone size={20} />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <Video size={20} />
            </button>
          </div>
        </div>
      </div>
       {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = isMyMessage(msg.sender_id);
            return (
              <div
                key={msg.id}
                className={flex ${isMe ? 'justify-end' : 'justify-start'}}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe
                      ? 'bg-green-500 text-white rounded-br-md'
                      : 'bg-white text-slate-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? 'text-green-100' : 'text-slate-400'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
       {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          {/* Attachment Button */}
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image size={20} />
          </button>

          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
                    {/* Send Button */}
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-2.5 rounded-full transition-colors ${
              newMessage.trim() && !sending
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>






