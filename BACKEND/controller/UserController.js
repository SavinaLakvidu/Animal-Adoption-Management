import {
  registerUserService,
  loginUserService,
  logoutUserService,
  updateUserService,
  forgotPasswordService,
  verifyEmailService,
  uploadAvatarService,
  verifyForgotPasswordOtpService,
} from "../service/UserService.js";

export async function registerUserController(req, res) {
  try {
    const savedUser = await registerUserService(req.body);

    const { accessToken } = await loginUserService({
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: savedUser,
      token: accessToken,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

// LOGIN
export async function loginController(req, res) {
  try {
    const { user, accessToken, refreshToken } = await loginUserService(req.body);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: isProd, sameSite: isProd ? "None" : "Lax" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: isProd, sameSite: isProd ? "None" : "Lax" });

    return res.status(200).json({ message: "User logged in successfully", data: { user, accessToken, refreshToken }, error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}

// LOGOUT
export async function logoutController(req, res) {
  try {
    await logoutUserService(req.userId);

    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });

    return res.status(200).json({ message: "User logged out successfully", error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}

// UPDATE USER
export async function updateUserDetails(req, res) {
  try {
    const updatedUser = await updateUserService(req.userId, req.body);
    return res.json({ message: "User updated successfully", data: updatedUser, error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}

// FORGOT PASSWORD
export async function forgotPasswordController(req, res) {
  try {
    const otp = await forgotPasswordService(req.body.email);
    return res.json({ message: "OTP sent successfully", otp, error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}

// VERIFY EMAIL
export async function verifyEmailController(req, res) {
  try {
    await verifyEmailService(req.body.code);
    return res.json({ message: "Email verified successfully", error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}

// UPLOAD AVATAR
export async function uploadAvatarController(req, res) {
  try {
    const data = await uploadAvatarService(req.userId, req.file);
    return res.json({ message: "Profile uploaded successfully", data, error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}

// VERIFY OTP (FORGOT PASSWORD)
export async function verifyForgotPasswordOtpController(req, res) {
  try {
    await verifyForgotPasswordOtpService(req.body.email, req.body.otp);
    return res.json({ message: "OTP verified successfully", error: false, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, error: true, success: false });
  }
}
