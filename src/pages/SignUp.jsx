import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Tractor, MapPin, Phone, ShoppingBag, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KENYAN_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"
];

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('farmer');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Pre-select role from navigation state
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    location: '',
    farm_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate phone number for registration
    if (!isLogin) {
      const phone = formData.phone_number.trim();
      const startsWith07 = /^07\d{8}$/.test(phone);
      const startsWith01 = /^01\d{8}$/.test(phone);
      const startsWith254 = /^\+254\d{9}$/.test(phone);

      if (!startsWith07 && !startsWith01 && !startsWith254) {
        setMessage({ 
          type: 'error', 
          text: 'Invalid phone number. Must start with 07/01 (10 digits) or +254 (13 digits).' 
        });
        setIsLoading(false);
        return;
      }
    }

    // Validate passwords match for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      // --- LOGIN LOGIC ---
      if (isLogin) {
        // Use AuthContext login function which sets loading state
        const loggedInUser = await login(formData);
        
        if (loggedInUser) {
          // Determine Role & Redirect using the returned user object
          const userRole = loggedInUser.user?.role || loggedInUser.role || '';
          const cleanRole = userRole.toLowerCase();
          
          if (cleanRole === 'admin') {
            window.location.href = '/admin';
          } else if (cleanRole === 'farmer') {
            window.location.href = '/farmer-dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        } else {
          setMessage({ type: 'error', text: 'Invalid credentials' });
        }
      } else {
        // --- REGISTRATION LOGIC ---
        const payload = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          location: formData.location,
          email: formData.email,
          password: formData.password,
          role: role,
        };
        
        // Farmers require farm_name
        if (role === 'farmer') {
          payload.farm_name = formData.farm_name;
        }
        
        const response = await fetch(`/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage({ type: 'error', text: data.error || data.message || 'Registration failed' });
          setIsLoading(false);
          return;
        }

        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Please log in.' 
        });
        setIsLogin(true);
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Connection failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto shadow-xl rounded-2xl bg-white p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Farmart</h1>
          <p className="text-slate-600 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Toast Notifications */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setMessage(null); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setMessage(null); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection (Register Mode Only) */}
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">I am a...</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${role === 'farmer' ? 'border-primary bg-green-50 text-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}
                >
                  <Tractor className={`w-5 h-5 ${role === 'farmer' ? 'text-primary' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${role === 'buyer' ? 'border-primary bg-green-50 text-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}
                >
                  <ShoppingBag className={`w-5 h-5 ${role === 'buyer' ? 'text-primary' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">Buyer</span>
                </button>
              </div>
            </div>
          )}

          {/* Personal Details Section (Register Mode Only) */}
          {!isLogin && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-grow h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-500 uppercase">Personal Details</span>
                <div className="flex-grow h-px bg-slate-200" />
              </div>
              <div className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <input 
                    type="text" 
                    name="full_name" 
                    value={formData.full_name} 
                    onChange={handleChange} 
                    placeholder="Full Name" 
                    required 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                  />
                </div>
                
                {/* Phone Number */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    name="phone_number" 
                    value={formData.phone_number} 
                    onChange={handleChange} 
                    placeholder="Phone Number (07X or +254)" 
                    required 
                    maxLength={13}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                  />
                </div>

                {/* Location (Type-to-Search) */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    list="county-list"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Search or Select County"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <datalist id="county-list">
                    {KENYAN_COUNTIES.map(county => (
                      <option key={county} value={county} />
                    ))}
                  </datalist>
                </div>

                {/* Farm Name (Farmer Only) */}
                {role === 'farmer' && (
                  <div className="relative">
                    <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      name="farm_name" 
                      value={formData.farm_name} 
                      onChange={handleChange} 
                      placeholder="Farm Name" 
                      required={role === 'farmer'}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Address" 
                required 
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
            </div>
            
            {/* Password Field with Visibility Toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Password" 
                required 
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Confirm Password Field (Register Only) */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm Password" 
                  required 
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="w-full mt-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Please wait...</span></> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">By continuing, you agree to Farmart's Terms of Service</p>

        {/* Removed System Health Check */}
      </div>
    </div>
  );
};

export default SignUp;
