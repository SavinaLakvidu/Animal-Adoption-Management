import {
  createMedicalRecordService,
  getAllMedicalRecordsService,
  getMedicalRecordByIdService,
  deleteMedicalRecordService,
  updateMedicalRecordService
} from "../service/MedicalRecordService.js";

export const createMedicalRecordController = async (req, res) => {
  try {
    const { mid, dueDate, vaccination, age, petId, vetId } = req.body;

    const newRecord = await createMedicalRecordService({
      mid,
      dueDate,
      vaccination,
      age,
      petId,
      vetId,
    });

    res.status(201).json({
      message: "Medical record created successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating medical record: " + error.message,
    });
  }
};

export const getAllMedicalRecordsController = async (req, res) => {
  try {
    const records = await getAllMedicalRecordsService();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMedicalRecordByIdController = async (req, res) => {
  try {
    const record = await getMedicalRecordByIdService(req.params.mid);
    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedicalRecordController = async (req, res) => {
  try {
    const { mid } = req.params;
    const updates = req.body;
    const updatedRecord = await updateMedicalRecordService(mid, updates);
    if (!updatedRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.status(200).json({ message: "Medical record updated", record: updatedRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMedicalRecordController = async (req, res) => {
  try {
    const deletedRecord = await deleteMedicalRecordService(req.params.mid);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
