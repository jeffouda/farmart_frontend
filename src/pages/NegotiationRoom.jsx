import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Send, ArrowLeft, CheckCircle, XCircle, 
  RefreshCw, Trash2, Loader2, AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const NegotiationRoom = () => {
  const navigate = useNavigate();
  
  // Extract sessionId from URL path manually since useParams isn't working
  const getSessionIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    const idIndex = pathParts.indexOf('negotiations') + 1;
    return pathParts[idIndex] || null;
  };
  
  const [sessionId, setSessionId] = useState(getSessionIdFromUrl());
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  // Update sessionId when URL changes
  useEffect(() => {
    const newId = getSessionIdFromUrl();
    if (newId !== sessionId) {
      setSessionId(newId);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      // Safety check: don't fetch if sessionId is undefined
      if (!sessionId || sessionId === 'undefined') {
        console.warn('Invalid session ID:', sessionId);
        setLoading(false);
        return;
      }
      
      try {
        try {
          const userRes = await api.get('/auth/me');
          setCurrentUser(userRes.data);
        } catch (userErr) {
          console.warn('User fetch failed, Guest Mode');
        }

        const sessionRes = await api.get('/bargain/sessions/' + sessionId);
        setSession(sessionRes.data.session);
        setMessages(Array.isArray(sessionRes.data.messages) ? sessionRes.data.messages : []);
      } catch (err) {
        console.error('Failed to load session:', err);
        toast.error('Failed to load negotiation room');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isMyMessage = (msg) => currentUser && msg.sender_id === currentUser.id;
  
  const isMyTurn = () => {
    if (!session || !currentUser) return false;
    if (!session.last_offer_by) return true;
    return session.last_offer_by !== currentUser.id;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMsg = {
      id: Date.now(),
      message: newMessage,
      sender_id: currentUser?.id,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await api.post('/bargain/sessions/' + sessionId + '/messages', {
        message: newMessage
      });
      const res = await api.get('/bargain/sessions/' + sessionId);
      setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
    } catch (err) {
      toast.error('Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message for everyone?')) return;
    
    setMessages(prev => prev.filter(m => m.id !== messageId));
    
    try {
      await api.delete('/bargain/sessions/' + sessionId + '/messages/' + messageId);
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
      const res = await api.get('/bargain/sessions/' + sessionId);
      setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
    }
  };

  const handleAccept = async () => {
    if (!window.confirm('Accept this offer?')) return;
    try {
      await api.post('/bargain/sessions/' + sessionId + '/accept');
      toast.success('Offer accepted!');
      const res = await api.get('/bargain/sessions/' + sessionId);
      setSession(res.data.session);
    } catch (err) {
      toast.error('Failed to accept offer');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Reject this negotiation?')) return;
    try {
      await api.post('/bargain/sessions/' + sessionId + '/reject');
      toast.success('Negotiation rejected');
      const res = await api.get('/bargain/sessions/' + sessionId);
      setSession(res.data.session);
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading Negotiation...</h2>
        <p className="text-gray-400 text-sm mt-2">Connecting to server</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-700">Session Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const canAct = session.status === 'active' && isMyTurn();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-sm border-b flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">
              Negotiation #{sessionId}
            </h1>
            <div className="flex items-center gap-2 text-xs mt-1">
              {session.status === 'active' ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Negotiation
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                  {session.status.toUpperCase()}
                </span>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">
                {currentUser ? 'Logged in as ' + currentUser.role : 'Guest View'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold">Current Offer</p>
          <p className="text-xl font-bold text-green-600">
            KES {session.current_price ? session.current_price.toLocaleString() : '---'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <Send className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">No messages yet. Start the negotiation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const myMsg = isMyMessage(msg);
            return (
              <div 
                key={msg.id || idx} 
                className={'flex ' + (myMsg ? 'justify-end' : 'justify-start') + ' group'}
              >
                {myMsg && session.status === 'active' && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all self-center mr-2"
                    title="Delete for everyone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className={'max-w-[75%] px-4 py-2 rounded-lg shadow-sm text-sm relative ' + 
                  (myMsg ? 'bg-[#d9fdd3] text-gray-800 rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none')
                }>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message || msg.content}</p>
                  <span className="text-[10px] text-gray-400 block text-right mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={currentUser ? "Type your offer or message..." : "Log in to negotiate"}
            disabled={!currentUser || session.status !== 'active'}
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !currentUser}
            className="bg-green-600 text-white p-3 rounded-full shadow hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {session.status === 'active' && currentUser && (
          canAct() ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleAccept}
                className="py-3 rounded-lg font-bold text-white shadow flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5" /> Accept
              </button>
              <button
                onClick={handleReject}
                className="py-3 rounded-lg font-bold text-white shadow flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-5 h-5" /> Reject
              </button>
              <button
                onClick={() => setNewMessage('KES ')}
                className="py-3 rounded-lg font-bold text-white shadow flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" /> Counter
              </button>
            </div>
          ) : (
            <div className="text-center p-3 bg-yellow-50 rounded-lg text-yellow-700 text-sm font-medium">
              Waiting for counter-offer...
            </div>
          )
        )}

        {session.status !== 'active' && (
          <div className="text-center p-3 bg-gray-100 rounded-lg text-gray-600 text-sm font-medium">
            {session.status === 'accepted' 
              ? 'Deal agreed!' 
              : session.status === 'rejected' 
                ? 'Negotiation rejected' 
                : 'Session closed'}
          </div>
        )}

        {!currentUser && session.status === 'active' && (
          <div className="text-center p-2 bg-gray-50 rounded text-xs text-gray-500">
            Guest Mode - Log in to participate
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiationRoom;
