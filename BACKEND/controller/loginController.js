import { getUserByEmail } from "../service/UserService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await getUserByEmail(userEmail);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    const { userPassword: pwd, ...userWithoutPassword } = user._doc;
    res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
