import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Tractor,
  MapPin,
  Phone,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const KENYAN_COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita/Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo/Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi City",
];

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("farmer");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    location: "",
    farm_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // --- Validation ---
    if (!isLogin) {
      // Phone number validation
      const phone = formData.phone_number.trim();
      const validPhone =
        /^07\d{8}$/.test(phone) ||
        /^01\d{8}$/.test(phone) ||
        /^\+254\d{9}$/.test(phone);

      if (!validPhone) {
        setMessage({
          type: "error",
          text: "Invalid phone number (07/01... or +254...)",
        });
        setIsLoading(false);
        return;
      }

      // Password match check
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // --- LOGIN ---
        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        const loggedInUser = await login(credentials);

        if (loggedInUser) {
          const userRole = (
            loggedInUser.role ||
            loggedInUser.user?.role ||
            ""
          ).toLowerCase();
          navigate(userRole === "farmer" ? "/farmer-dashboard" : "/dashboard");
        } else {
          setMessage({ type: "error", text: "Invalid email or password" });
        }
      } else {
        // --- REGISTRATION ---
        const payload = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          location: formData.location,
          email: formData.email,
          password: formData.password,
          role: role,
          ...(role === "farmer" && { farm_name: formData.farm_name }),
        };

        await api.post("/auth/register", payload);

        setMessage({
          type: "success",
          text: "Account created successfully! Please log in.",
        });
        setIsLogin(true);
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Action failed";
      setMessage({ type: "error", text: errorMsg });
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
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Toggle SignIn / SignUp */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${isLogin ? "bg-white text-green-600 shadow-sm" : "text-slate-600"}`}>
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${!isLogin ? "bg-white text-green-600 shadow-sm" : "text-slate-600"}`}>
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Role Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  I am a...
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("farmer")}
                    className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${role === "farmer" ? "border-green-600 bg-green-50 text-green-600" : "border-slate-200 text-slate-600"}`}>
                    <Tractor className="w-5 h-5" />
                    <span className="text-sm font-medium">Farmer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${role === "buyer" ? "border-green-600 bg-green-50 text-green-600" : "border-slate-200 text-slate-600"}`}>
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm font-medium">Buyer</span>
                  </button>
                </div>
              </div>

              {/* Farmer fields */}
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-2.5 border rounded-lg text-sm"
              />
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone (07...)"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  list="county-list"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Select County"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm"
                />
                <datalist id="county-list">
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              {role === "farmer" && (
                <input
                  type="text"
                  name="farm_name"
                  value={formData.farm_name}
                  onChange={handleChange}
                  placeholder="Farm Name"
                  required
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                />
              )}
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400">
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400">
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
