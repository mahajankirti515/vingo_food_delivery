import { useNavigate } from 'react-router-dom';
import React from "react";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios'
import { serverURL } from '../App';
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async() => {
    setLoading(true)
      try {
        const result = await axios.post(`${serverURL}/api/auth/send-otp`,{
            email
        }, {withCredentials: true})
        console.log(result.data);
        setErr("")
        setStep(2)
        setLoading(false)
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        setLoading(false)
    }
  }


  const handleVerifyOtp = async() => {
    setLoading(true)
      try {
        const result = await axios.post(`${serverURL}/api/auth/verify-otp`,{
            email,otp
        }, {withCredentials: true})
        console.log(result);
        setErr("")
        setStep(3)
        setLoading(false)
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        setLoading(false)
    }
  }

  const handleResetPassword = async() => {
    if(newPassword != confirmPassword) 
    {
      return null
    }
    setLoading(true)
      try {
        const result = await axios.post(`${serverURL}/api/auth/reset-password`,{
            email,newPassword
        }, {withCredentials: true})
        setErr("")
        console.log(result.data);
        navigate('/signin')
        setLoading(false)
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        setLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex gap-4 items-center mb-4">
          <FaArrowLeftLong 
          size={30} 
          className="text-[#ff4d2d] cursor-pointer"
          onClick={()=>navigate('/signin')}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <div>
            <div className="mt-6">
              <label
                htmlFor="email"
                className="block font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
            <button 
            className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 cursor-pointer"
            onClick={handleSendOtp} disabled={loading}
            > 
             {loading ? <ClipLoader size={20} color="white"/> :  "Send OTP"}
            </button>
            {err && <p className='text-red-500 text-center my-10'>*{err}</p>}
          </div>
        )}

          {step == 2 && (
          <div>
            <div className="mt-6">
              <label
                htmlFor="otp"
                className="block font-medium text-gray-700 mb-1"
              >
                OTP
              </label>
              <input
                type="otp"
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
            <button 
            className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 cursor-pointer"
            onClick={handleVerifyOtp} disabled={loading}
            >
             {loading ? <ClipLoader size={20} color="white"/> :  "Verify"}
            </button>
            {err && <p className='text-red-500 text-center my-10'>*{err}</p>}
          </div>
        )}

          {step == 3 && (
          <div>
            <div className="mt-6">
              <label
                htmlFor="NewPassword"
                className="block font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="ConfirmPassword"
                className="block font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
            <button 
            className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 cursor-pointer"
            onClick={handleResetPassword} disabled={loading}  
            >
             {loading ? <ClipLoader size={20} color="white"/> :  "Reset Password"}
            </button>
            {err && <p className='text-red-500 text-center my-10'>*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
