import express from 'express';
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerUserController,
  updateUserDetails,
  uploadAvatarController,
  verifyEmailController,
  verifyForgotPasswordOtpController, // include if you use it in routes
} from '../controller/UserController.js';

import { authenticate as auth } from '../middleware/authMiddleware.js'; // updated auth middleware
import upload from '../middleware/upload.js'; // multer middleware for file uploads

const userRouter = express.Router();

// Registration
userRouter.post('/register', registerUserController);

// Login
userRouter.post('/login', loginController);

// Logout
userRouter.get('/logout', auth, logoutController);

// Update user details
userRouter.put('/updateUser', auth, updateUserDetails);

// Verify email
userRouter.post('/verify-email', verifyEmailController);

// Upload avatar
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatarController);

// Forgot password
userRouter.post('/forgot-password', forgotPasswordController);

// Verify OTP (forgot password)
userRouter.post('/verify-otp', verifyForgotPasswordOtpController); // optional

export default userRouter;
