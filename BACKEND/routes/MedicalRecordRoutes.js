import express from "express";
import {
  createMedicalRecordController,
  getAllMedicalRecordsController,
  getMedicalRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController
} from "../controller/MedicalRecordController.js";

const medicalRecordRouter = express.Router();

medicalRecordRouter.post("/", createMedicalRecordController);       // Create
medicalRecordRouter.get("/", getAllMedicalRecordsController);       // Get all
medicalRecordRouter.get("/:mid", getMedicalRecordByIdController);   // Get by MID
medicalRecordRouter.put("/:mid", updateMedicalRecordController);    // Update
medicalRecordRouter.delete("/:mid", deleteMedicalRecordController); // Delete by MID

export default medicalRecordRouter;
