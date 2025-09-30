import express from "express";
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordByMid,
  getMedicalRecordsByAnimalId,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controller/MedicalRecordController.js";

const router = express.Router();

// Create
router.post("/", createMedicalRecord);

// Get all
router.get("/", getAllMedicalRecords);

// Get by mid
router.get("/:mid", getMedicalRecordByMid);

// Get by animalId
router.get("/animal/:animalId", getMedicalRecordsByAnimalId);

// Update
router.put("/:mid", updateMedicalRecord);

// Delete
router.delete("/:mid", deleteMedicalRecord);

export default router;
