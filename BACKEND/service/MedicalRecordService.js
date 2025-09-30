import MedicalRecord from "../model/MedicalRecord.js";

// Create
export const createMedicalRecord = async (data) => {
  const record = new MedicalRecord(data);
  return await record.save();
};

// Get all
export const getAllMedicalRecords = async () => {
  return await MedicalRecord.find();
};

// Get by mid
export const getMedicalRecordByMid = async (mid) => {
  return await MedicalRecord.findOne({ mid });
};

// Get by animalId
export const getMedicalRecordsByAnimalId = async (animalId) => {
  return await MedicalRecord.find({ animalId });
};

// Update
export const updateMedicalRecord = async (mid, data) => {
  return await MedicalRecord.findOneAndUpdate(
    { mid },
    { $set: data },
    {new: true, runValidators: true,
    }
  );
};

// Delete
export const deleteMedicalRecord = async (mid) => {
  return await MedicalRecord.findOneAndDelete({ mid });
};
