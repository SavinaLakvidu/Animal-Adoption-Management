import express from "express";
import {
  createPetProfileController,
  getAllPetProfilesController,
  getPetProfileByIdController,
  updatePetProfileController,
  deletePetProfileController,
} from "../controller/PetProfileController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const PetProfileRouter = express.Router();

PetProfileRouter.post("/", createPetProfileController);      // Create
PetProfileRouter.get("/", getAllPetProfilesController);      // Read all
PetProfileRouter.get("/:id", getPetProfileByIdController);   // Read one   
PetProfileRouter.put("/:id", updatePetProfileController);    // Update
PetProfileRouter.delete("/:id", deletePetProfileController); // Delete


export default PetProfileRouter;
