import React from 'react'
import { useState } from 'react';
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { serverURL } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice';


const SignUp = () => {

  const primaryColor = '#ff4d2d';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[err,setErr] = useState('');
  const[loading,setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignIn = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
        const result = await axios.post(`${serverURL}/api/auth/signin`,{
            email,password
        }, {withCredentials: true})
        console.log(result.data);
        dispatch(setUserData(result.data.user))
        setErr("")
        setLoading(false);
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        setLoading(false)
    }
  }

   const handleGoogleAuth=async()=>{
         const provider = new GoogleAuthProvider();
         const result = await signInWithPopup(auth,provider);
         try {
           const data = axios.post(`${serverURL}/api/auth/google-auth`,{
            email:result.user.email,
           },{withCredentials: true})
           dispatch(setUserData(data.user))
           console.log(data);
         } catch (error) {
          console.log(error.response?.data?.message || error.message);
         }
    }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4" style={{backgroundColor: bgColor}}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8" style={{border: `1px solid ${borderColor}`}}>
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-2" style={{color:primaryColor}}>Vingo</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Welcome back! Please sign in to continue enjoying delicious food
          deliveries
        </p>

        {/* Email */}
        <div className="mt-4">
          <label htmlFor='email' className="block font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder='Enter your Email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{border: `1px solid ${borderColor}`}}
            required
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
              style={{border: `1px solid ${borderColor}`}}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(prev=>!prev)}
            >
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </button>
          </div>
          <p className="text-right mt-1">
            <Link to='/forgot-password' className="text-sm text-[#ff4d2d] hover:underline cursor-pointer">
              Forgot Password?
            </Link>
          </p>
        </div>

        {/* Sign up Button */}
        <button className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 cursor-pointer" 
        onClick={handleSignIn}
        disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> :  "Sign In"}
        </button>

        {/* Google Sign In */}
        <button 
        onClick={handleGoogleAuth}
        className="w-full mt-4 flex gap-2 items-center justify-center border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer">
          <FcGoogle size={20} />
          Sign in with Google
        </button>
        {err && <p className='text-red-500 text-center my-10'>*{err}</p>}

        {/* Footer */}
        <p className="text-center mt-6 cursor-pointer" onClick={()=>navigate('/signup')}>
          Don’t have an account?{" "}
          <span className="text-[#ff4d2d] font-medium ">
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp