import * as medicalRecordService from "../service/MedicalRecordService.js";

// Create
export const createMedicalRecord = async (req, res) => {
  try {
    const record = await medicalRecordService.createMedicalRecord(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await medicalRecordService.getAllMedicalRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by mid
export const getMedicalRecordByMid = async (req, res) => {
  try {
    const record = await medicalRecordService.getMedicalRecordByMid(req.params.mid);
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by animalId
export const getMedicalRecordsByAnimalId = async (req, res) => {
  try {
    const records = await medicalRecordService.getMedicalRecordsByAnimalId(req.params.animalId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateMedicalRecord = async (req, res) => {
  try {
    const updated = await medicalRecordService.updateMedicalRecord(req.params.mid, req.body);
    if (!updated) return res.status(404).json({ message: "Medical record not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteMedicalRecord = async (req, res) => {
  try {
    const deleted = await medicalRecordService.deleteMedicalRecord(req.params.mid);
    if (!deleted) return res.status(404).json({ message: "Medical record not found" });
    res.json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
