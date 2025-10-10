import express from "express";
import {
  createAdoptionFormController,
  getAdoptionFormsController,
  getAdoptionFormByIdController,
  updateAdoptionFormController,
  deleteAdoptionFormController,
} from "../controller/AdoptionFormController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create adoption form (any logged-in user)
router.post("/", authenticate, createAdoptionFormController);

// Get all adoption forms (admin only)
router.get("/", authenticate, getAdoptionFormsController);

// Get adoption form by ID (admin or adopter only)
router.get("/:id", authenticate, getAdoptionFormByIdController);

// Update adoption form (admin only)
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateAdoptionFormController);

// Delete adoption form (admin only)
router.delete("/:id", authenticate, deleteAdoptionFormController);

export default router;
