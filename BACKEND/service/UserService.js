import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import generatedAccessToken from "../util/generatedAccessToken.js";
import generatedRefreshToken from "../util/generatedRefreshToken.js";
import generatedOtp from "../util/generatedOtp.js";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../util/verifyEmailTemplate.js";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";

// Register new user
export const registerUserService = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Force role to USER unless explicitly set by an authenticated admin in a protected route
  const normalizedRole = (role || "USER").toUpperCase();
  const finalRole = normalizedRole === "ADMIN" ? "USER" : normalizedRole;

  // Generate unique userID
  const userID = `U-${uuidv4()}`; // globally unique

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: finalRole,
    userID,
  });

  const savedUser = await newUser.save();

  // Send verification email
  const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;
  await sendEmail({
    sendTo: savedUser.email,
    subject: "Welcome to Pawfect Home site",
    html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
  });

  return savedUser;
};

// Login user
export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not registered");
  if (user.status !== "ACTIVE") throw new Error("User is inactive");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = await generatedAccessToken(user._id);
  const refreshToken = await generatedRefreshToken(user._id);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { last_login_date: new Date() },
    { new: true }
  );

  return { user: updatedUser, accessToken, refreshToken };
};

// Logout user
export const logoutUserService = async (userId) => {
  if (!userId) throw new Error("User not found");
  await User.findByIdAndUpdate(userId, { refresh_token: "" });
  return true;
};

// Update user details
export const updateUserService = async (userId, { name, email, password, mobile }) => {
  if (!userId) throw new Error("User not found");

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.updateOne(
    { _id: userId },
    { name, email, password: hashedPassword || undefined, mobile }
  );

  return updatedUser;
};

// Forgot password (generate OTP)
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = generatedOtp();
  const expireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await User.findByIdAndUpdate(user._id, {
    forgot_password_otp: otp,
    forgot_password_expiry: expireTime,
  });

  // TODO: Send OTP via email
  return otp;
};

// Verify email
export const verifyEmailService = async (code) => {
  const user = await User.findById(code);
  if (!user) throw new Error("Invalid code");

  await User.findByIdAndUpdate(user._id, { verify_email: true });
  return true;
};

// Upload avatar
export const uploadAvatarService = async (userId, image) => {
  if (!userId) throw new Error("User not found");

  const upload = await uploadImageCloudinary(image);
  const updatedUser = await User.findByIdAndUpdate(userId, { avatar: upload.url });

  return { _id: userId, avatar: upload.url };
};

// Verify OTP (forgot password)
export const verifyForgotPasswordOtpService = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email is not available");

  const currentTime = new Date();
  if (user.forgot_password_expiry < currentTime) throw new Error("OTP is expired");
  if (otp !== user.forgot_password_otp) throw new Error("Invalid OTP");

  await User.findByIdAndUpdate(user._id, {
    forgot_password_expiry: null,
    forgot_password_otp: null,
  });

  return true;
};