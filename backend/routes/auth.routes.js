import express from 'express'
import { googleAuth, logout, resetPassword, sendOTP, signIn, signUp, verifyOtp } from '../controllers/auth.controller.js';

export const authRouter =  express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/signout', logout);
authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/google-auth', googleAuth);
