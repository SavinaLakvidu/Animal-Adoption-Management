import express from "express";
import { createUserController, getAllUsers } from "../controller/UserController.js";
import { loginController } from "../controller/loginController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", createUserController);

// Login
router.post("/login", loginController);

// Get all users (protected route, admin only)
router.get("/", authenticate, authorizeRoles("admin"), getAllUsers);

export default router;
