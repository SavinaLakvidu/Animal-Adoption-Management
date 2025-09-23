// BACKEND/services/UserService.js
import User from "../model/user.js";
import bcrypt from "bcrypt";

// Create a new user
export const createUserService = async (userData) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.userPassword, 10);

    // Create new user instance
    const user = new User({ ...userData, userPassword: hashedPassword });

    // Save to MongoDB
    await user.save();

    // Remove password before returning
    const { userPassword, ...userWithoutPassword } = user._doc;
    return userWithoutPassword;
  } catch (error) {
    // Handle duplicate email or ID
    if (error.code === 11000) {
      throw new Error("User with this Email or ID already exists");
    }
    throw new Error("Error creating user: " + error.message);
  }
};

// Find user by email (for login)
export const getUserByEmail = async (email) => {
  return await User.findOne({ userEmail: email });
};
