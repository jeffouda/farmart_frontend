import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Tractor, MapPin, Phone, ShoppingBag, Loader2, AlertCircle, CheckCircle2, Sprout } from 'lucide-react';

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('farmer');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    farm_name: '',
    location: '',
    phone_number: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate passwords match for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin 
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, role };

    try {
      const response = await axios.post(endpoint, payload);
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      setMessage({ 
        type: 'success', 
        text: isLogin ? 'Welcome back! Login successful.' : 'Welcome to Farmart! Account created.' 
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Connection failed. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <Sprout className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Farmart</h1>
        </div>

        {/* Form Card */}
        <div className="bg-card shadow-lg rounded-xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
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
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setMessage(null); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setMessage(null); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selection (Register Mode Only) */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">I am a...</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${role === 'farmer' ? 'border-primary bg-primary/5 text-primary' : 'border-input text-muted-foreground hover:border-primary/50'}`}
                  >
                    <Tractor className={`w-5 h-5 ${role === 'farmer' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Farmer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${role === 'buyer' ? 'border-primary bg-primary/5 text-primary' : 'border-input text-muted-foreground hover:border-primary/50'}`}
                  >
                    <ShoppingBag className={`w-5 h-5 ${role === 'buyer' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Buyer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Farmer Fields */}
            {role === 'farmer' && !isLogin && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-grow h-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground uppercase">Farm Details</span>
                  <div className="flex-grow h-px bg-border" />
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" name="farm_name" value={formData.farm_name} onChange={handleChange} placeholder="Farm Name" className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Farm Location" className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
              </div>
              
              {/* Password Field with Visibility Toggle */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Password" 
                  required 
                  className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Confirm Password Field (Register Only) */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirm Password" 
                    required 
                    className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full mt-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Please wait...</span></> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
            </button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">By continuing, you agree to Farmart's Terms of Service</p>
      </div>
    </div>
  );
};

export default SignUp;
