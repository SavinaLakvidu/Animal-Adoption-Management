import express from "express";
import {
  createPetProfileController,
  getAllPetProfilesController,
  getPetProfileByIdController,
  updatePetProfileController,
  deletePetProfileController,
  updateMedicalInfoController,
} from "../controller/PetProfileController.js";

const PetProfileRouter = express.Router();

PetProfileRouter.post("/", createPetProfileController);      // Create
PetProfileRouter.get("/", getAllPetProfilesController);      // Read all
PetProfileRouter.get("/:id", getPetProfileByIdController);   // Read one   
PetProfileRouter.put("/:id", updatePetProfileController);    // Update
PetProfileRouter.delete("/:id", deletePetProfileController); // Delete
PetProfileRouter.put("/:id/medical", updateMedicalInfoController);


export default PetProfileRouter;
