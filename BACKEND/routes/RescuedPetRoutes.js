import express from "express";
import {
  createRescuedPet,
  getRescuedPets,
  confirmRescuedPet
} from "../controller/RescuedPetController.js";

const router = express.Router();

// Admin creates rescued pet
router.post("/", createRescuedPet);

// Admin & Vet view rescued pets
router.get("/", getRescuedPets);

// Vet confirms pet
router.put("/confirm/:id", confirmRescuedPet);

export default router;
