import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Send, ArrowLeft, ArrowRight, CheckCircle, 
  Clock, Image as ImageIcon, DollarSign 
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const NegotiationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState(null);
  const [animal, setAnimal] = useState(null);
  const messagesEndRef = useRef(null);

  // --- 1. SMART BACK BUTTON ---
  const handleBack = () => {
    if (currentUser?.role === 'farmer') {
      navigate('/farmer-dashboard');
    } else {
      navigate('/negotiations'); // Back to list
    }
  };

  // --- 2. FETCH & POLL DATA ---
  useEffect(() => {
    fetchSessionData();
    const interval = setInterval(fetchSessionData, 3000); 
    return () => clearInterval(interval);
  }, [id]);

  const fetchSessionData = async () => {
    try {
      const res = await api.get(`/bargain/sessions/${id}`);
      setSession(res.data.session);
      setMessages(res.data.messages || []);
      setAnimal(res.data.animal);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 3. ACTIONS ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post(`/bargain/sessions/${id}/messages`, {
        content: newMessage,
        sender_id: currentUser.id
      });
      setNewMessage('');
      fetchSessionData();
    } catch (err) {
      toast.error("Failed to send");
    }
  };

  const handleProceedToPayment = () => {
    // Logic: If order exists, go to list. If not, go to Checkout.
    if (session?.order_id) {
       navigate('/dashboard/orders');
    } else {
       navigate(`/checkout/${session.animal_id}?price=${session.final_price}&bargain_id=${session.id}`);
    }
  };

  if (!session) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    // PAGE CONTAINER: Gray background, centered content
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 flex items-center justify-center">
      
      {/* THE CENTERED CHAT CARD */}
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* --- HEADER --- */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
               {animal?.image_url && (
                 <img src={animal.image_url} alt="Cow" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
               )}
               <div>
                 <h2 className="font-bold text-gray-800 text-lg">
                   {animal?.breed || "Livestock Negotiation"}
                 </h2>
                 <p className="text-xs text-gray-500">
                   {session.status === 'active' ? '🟢 Negotiating...' : '🔴 Session Closed'}
                 </p>
               </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 uppercase font-semibold">Listing Price</p>
            <p className="font-bold text-xl text-green-700">KES {animal?.price?.toLocaleString()}</p>
          </div>
        </div>

        {/* --- MESSAGES AREA --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                  isMe 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* SYSTEM MESSAGE: DEAL AGREED */}
          {session.status === 'accepted' && (
            <div className="flex justify-center my-6">
               <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                 🤝 Deal Agreed at <span className="font-bold">KES {session.final_price?.toLocaleString()}</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- FOOTER (The Logic Core) --- */}
        <div className="bg-white border-t border-gray-100 p-4 shrink-0">
          
          {session.status === 'accepted' ? (
             /* --- PAYMENT / ORDER STATUS STATE --- */
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
               
               {/* Left: Status Message */}
               <div className="flex items-center gap-3">
                  {session.order_id && session.order_status === 'paid' ? (
                     <div className="bg-white p-2 rounded-full shadow-sm">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                     </div>
                  ) : session.order_id ? (
                     <div className="bg-white p-2 rounded-full shadow-sm">
                        <Clock className="w-8 h-8 text-yellow-600" />
                     </div>
                  ) : (
                     <div className="bg-white p-2 rounded-full shadow-sm">
                        <DollarSign className="w-8 h-8 text-green-600" />
                     </div>
                  )}
                  
                  <div>
                    {session.order_id ? (
                      <>
                        <p className="font-bold text-gray-800">
                          {session.order_status === 'paid' ? 'Transaction Complete' : 'Order Placed'}
                        </p>
                        <p className="text-sm text-gray-600">Order #{session.order_id}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-green-800">Deal Reached!</p>
                        <p className="text-sm text-green-700">Please proceed to checkout.</p>
                      </>
                    )}
                  </div>
               </div>

               {/* Right: Action Button */}
               {session.order_id ? (
                  <button 
                    onClick={() => navigate('/dashboard/orders')}
                    className="w-full md:w-auto px-6 py-3 bg-white border border-green-200 text-green-700 font-medium rounded-lg hover:bg-green-50 transition shadow-sm"
                  >
                    View Receipt
                  </button>
               ) : (
                  <button 
                    onClick={handleProceedToPayment}
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    Pay Now <ArrowRight className="w-5 h-5" />
                  </button>
               )}
             </div>

          ) : (
             /* --- CHAT INPUT STATE --- */
             <form onSubmit={handleSendMessage} className="flex items-center gap-3">
               <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <ImageIcon className="w-6 h-6" />
               </button>
               
               <input
                 type="text"
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Type your offer..."
                 className="flex-1 bg-gray-100 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 border-transparent transition-all"
               />
               
               <button 
                 type="submit" 
                 disabled={!newMessage.trim()}
                 className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center min-w-[3rem]"
               >
                 <Send className="w-5 h-5" />
               </button>
             </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default NegotiationRoom;
