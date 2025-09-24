import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { auth } from "../../firebase";
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../redux/userSlice";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user data from Redux to handle automatic redirect
  const user = useSelector(state => state.user?.userData);

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (user && user.email) {
      navigate('/home'); // or your dashboard route
    }
  }, [user, navigate]);

  // Form validation function
  const validateForm = () => {
    if (!fullName.trim()) {
      setErr("Full name is required");
      return false;
    }
    if (!email.trim()) {
      setErr("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErr("Please enter a valid email address");
      return false;
    }
    if (!mobile.trim()) {
      setErr("Mobile number is required");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setErr("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!password) {
      setErr("Password is required");
      return false;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErr(""); // Clear previous errors

    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signup`,
        {
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          mobile: mobile.trim(),
          password,
          role,
        },
        { withCredentials: true }
      );
      
      dispatch(setUserData(result.data.user));
      console.log(result.data.user);
      
      // Navigate to home after successful signup
      navigate('/home');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      console.error('Signup error:', errorMessage);
      setErr(errorMessage);
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  const handleGoogleAuth = async () => {
    // Validate mobile number before Google auth
    if (!mobile.trim()) {
      setErr("Mobile number is required for Google sign-up");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setErr("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setErr(""); // Clear previous errors

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Added await and fixed data handling
      const response = await axios.post(
        `${serverURL}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile: mobile.trim(),
          role,
          photoURL: result.user.photoURL,
          uid: result.user.uid, // Include Firebase UID
        },
        { withCredentials: true }
      );
      
      console.log(response.data);
      dispatch(setUserData(response.data.user)); // Fixed: response.data not data
      
      // Navigate to home after successful Google signup
      navigate('/home');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Google sign-up failed';
      console.error('Google auth error:', errorMessage);
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Vingo
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Create your account to get started with delicious food deliveries
        </p>

        {/* Form */}
        <form onSubmit={handleSignUp}>
          {/* FullName */}
          <div className="mt-4">
            <label
              htmlFor="fullName"
              className="block font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
              required
              disabled={loading}
            />
          </div>

          {/* Mobile */}
          <div className="mt-4">
            <label
              htmlFor="mobile"
              className="block font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} // Only allow digits
              maxLength="10"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ border: `1px solid ${borderColor}` }}
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                style={{ border: `1px solid ${borderColor}` }}
                required
                disabled={loading}
                minLength="6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="mt-4">
            <label className="block font-medium text-gray-700 mb-1">Role</label>
            <div className="flex gap-2">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className="flex-1 rounded-lg border px-3 py-2 text-center font-medium transition-colors cursor-pointer disabled:opacity-50"
                  onClick={() => setRole(r)}
                  disabled={loading}
                  style={
                    role === r
                      ? { backgroundColor: primaryColor, color: "white" }
                      : {
                          border: `1px solid ${primaryColor}`,
                          color: primaryColor,
                        }
                  }
                >
                  {r === "deliveryBoy" ? "Delivery" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sign up Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>
        </form>

        {/* Error Message */}
        {err && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">
              {err}
            </p>
          </div>
        )}

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 flex gap-2 items-center justify-center border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FcGoogle size={20} />
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        {/* Footer */}
        <p className="text-center mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-[#ff4d2d] font-medium hover:underline cursor-pointer"
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
