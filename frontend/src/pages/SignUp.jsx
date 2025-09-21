import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { auth } from "../../firebase";
import { ClipLoader } from 'react-spinners'
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const handleSignUp = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signup`,
        {
          fullName,
          email,
          mobile,
          password,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data.user))
      console.log(result.data.user);
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setErr("mobile number is required");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const data = axios.post(
        `${serverURL}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data.user))
      console.log(data.user);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
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
          create your account to get started with delicious food deliveries
        </p>

        {/* FullName */}
        <div className="mt-4">
          <label
            htmlFor="fullName"
            className="block font-medium text-gray-700 mb-1"
          >
            FullName
          </label>
          <input
            type="text"
            placeholder="Enter your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{ border: `1px solid ${borderColor}` }}
            required
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
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{ border: `1px solid ${borderColor}` }}
            required
          />
        </div>

        {/* {mobile} */}
        <div className="mt-4">
          <label
            htmlFor="mobile"
            className="block font-medium text-gray-700 mb-1"
          >
            mobile no
          </label>
          <input
            type="text"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{ border: `1px solid ${borderColor}` }}
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
              style={{ border: `1px solid ${borderColor}` }}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </button>
          </div>
        </div>

        {/* role */}
        <div className="mt-4">
          <label className="block font-medium text-gray-700 mb-1">Role</label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                className="flex-1 rounded-lg border px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sign up Button */}
        <button
          className="w-full mt-4 bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg font-semibold transition duration-200 cursor-pointer"
          onClick={handleSignUp} disabled={loading}
        >{loading ? <ClipLoader size={20} color="white" /> :  "Sign Up"}
          
        </button>
        {err && <p className="text-red-500 text-center my-10">*{err}</p>}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 flex gap-2 items-center justify-center border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer"
        >
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        {/* Footer */}
        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-[#ff4d2d] font-medium ">Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
