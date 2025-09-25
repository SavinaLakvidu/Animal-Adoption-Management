import express from "express";
import {
  createRescuedPet,
  getRescuedPets,
  confirmRescuedPet,
  updateRescuedPet,
  deleteRescuedPet,
  updateRescuedPetByCode,
  deleteRescuedPetByCode,
} from "../controller/RescuedPetController.js";

const router = express.Router();

// Admin creates rescued pet
router.post("/", createRescuedPet);

// Admin & Vet view rescued pets
router.get("/", getRescuedPets);

// Vet confirms pet
router.put("/confirm/:id", confirmRescuedPet);

// Update rescued pet
router.put("/:id", updateRescuedPet);

// Delete rescued pet
router.delete("/:id", deleteRescuedPet);

// Alternative: by rescuedPetId business code
router.put("/code/:code", updateRescuedPetByCode);
router.delete("/code/:code", deleteRescuedPetByCode);

export default router;
