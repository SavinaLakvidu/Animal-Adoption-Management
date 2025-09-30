import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-userPassword");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach full user object
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this resource" });
    }
    next();
  };
};
