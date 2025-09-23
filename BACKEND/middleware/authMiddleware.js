import jwt from "jsonwebtoken";
import User from "../model/user.js";

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // Attach user info to request object
    const user = await User.findById(decoded.id).select("-userPassword");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // now req.user is accessible in controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Optional: Middleware to check role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to access this resource" });
    }
    next();
  };
};
