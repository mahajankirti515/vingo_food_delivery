import React, { useState, useEffect } from 'react';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { serverURL } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/userSlice';

const SignIn = () => { // Changed from SignUp to SignIn (correct component name)

  const primaryColor = '#ff4d2d';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
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

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setErr('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErr(''); // Clear previous errors

    try {
      const result = await axios.post(`${serverURL}/api/auth/signin`, {
        email,
        password
      }, { withCredentials: true });

      console.log(result.data);
      dispatch(setUserData(result.data.user));
      
      // Navigate to home after successful login
      navigate('/home');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Sign in failed';
      console.error('Sign in error:', errorMessage);
      setErr(errorMessage);
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErr(''); // Clear previous errors

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Added await and fixed data handling
      const response = await axios.post(`${serverURL}/api/auth/google-auth`, {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: result.user.uid, // Include Firebase UID
      }, { withCredentials: true });
      
      console.log(response.data);
      dispatch(setUserData(response.data.user)); // Fixed: response.data not data
      
      // Navigate to home after successful Google auth
      navigate('/home');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Google sign-in failed';
      console.error('Google auth error:', errorMessage);
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4" style={{backgroundColor: bgColor}}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8" style={{border: `1px solid ${borderColor}`}}>
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-2" style={{color: primaryColor}}>Vingo</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Welcome back! Please sign in to continue enjoying delicious food deliveries
        </p>

        {/* Form */}
        <form onSubmit={handleSignIn}>
          {/* Email */}
          <div className="mt-4">
            <label htmlFor='email' className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder='Enter your Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{border: `1px solid ${borderColor}`}}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                style={{border: `1px solid ${borderColor}`}}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
                disabled={loading}
              >
                {showPassword ? <IoIosEye size={20} /> : <IoIosEyeOff size={20} />}
              </button>
            </div>
            <p className="text-right mt-1">
              <Link 
                to='/forgot-password' 
                className="text-sm text-[#ff4d2d] hover:underline cursor-pointer"
              >
                Forgot Password?
              </Link>
            </p>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit"
            className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
          </button>
        </form>

        {/* Google Sign In */}
        <button 
          onClick={handleGoogleAuth}
          className="w-full mt-4 flex gap-2 items-center justify-center border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FcGoogle size={20} />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Error Message */}
        {err && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className='text-red-600 text-sm text-center'>
              {err}
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center mt-6">
          Don't have an account?{" "}
          <button 
            onClick={() => navigate('/signup')}
            className="text-[#ff4d2d] font-medium hover:underline cursor-pointer"
            disabled={loading}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn; // Changed from SignUp to SignIn
