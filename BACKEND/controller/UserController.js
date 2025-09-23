import { createUserService } from "../service/UserService.js";
import User from "../model/user.js";

// Register new user
export const createUserController = async (req, res) => {
  console.log("POST /users/register body:", req.body);
  try {
    const { userDob, userName, userEmail, userAddress, userPhone, userPassword, role } = req.body;

    // Check required fields
    if (!userDob || !userName || !userEmail || !userAddress || !userPhone || !userPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Create user via service
    const newUser = await createUserService({ userDob, userName, userEmail, userAddress, userPhone, userPassword, role });

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get all users (for testing/admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-userPassword"); // exclude passwords
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
