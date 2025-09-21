import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async(req,res) => {
    try {
        const {fullName, email, password,mobile,role} = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        if(mobile.length < 10){
            return res.status(400).json({message: "Mobile number must be at least 10 digits"});
        }

        const hashPassword = await bcrypt.hash(password,10);

        let user = await User.create({
            fullName,
            email,
            password: hashPassword,
            mobile,
            role
        })

        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return res.status(201).json({message: "User created successfully", user, token});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const signIn = async(req,res) => {
    try {
        const {email, password} = req.body;
        
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exists"});
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message: "Invalid Password"});
        }

        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return res.status(201).json({message: "User login successfully", user});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const logout = async(req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const sendOTP = async(req,res) => {
    try {
        const {email} = req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exits."})
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
         user.resetOtp=otp
         user.otpExpires=Date.now()+5*60*1000
         user.isOtpVerified=false
         await sendOtpMail(email,otp)
         await user.save()
         return res.status(200).json({message:"otp send successfully"})
    } catch (error) {
        return res.status(500).json(`send opt error ${error}`)
    }
}

export const verifyOtp = async(req,res) => {
    try {
        const { email, otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
            return res.status(400).json({message:"Invalid/expired otp"})
        }

        user.isOtpVerified=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res.status(200).json({message:"otp verify successfully"})
    } catch (error) {
        return res.status(500).json(`opt verify error ${error}`)
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {email, newPassword} = req.body
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verification required"})
        }

        const hashPassword = await bcrypt.hash(newPassword,10)
        user.password = hashPassword
        user.isOtpVerified=false
        await user.save()
        return res.status(200).json({message:"Password reset successfully"})
    } catch (error) {
       return res.status(500).json(`reset password error ${error}`)
    }
}


export const googleAuth = async(req,res) => {
    try {
        const { fullName, email,mobile, role} = req.body
        let user = await User.findOne({email})

        if(!user){
            user = await User.create({
               fullName, email,mobile, role
            })
        }

         const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json(`Google auth error ${error}`)
    }
}
