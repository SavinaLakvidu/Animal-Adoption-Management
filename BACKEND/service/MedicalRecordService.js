import MedicalRecord from "../model/MedicalRecord.js";

export const createMedicalRecordService = async (recordData) => {
  try {
    const record = new MedicalRecord(recordData);
    await record.save();
    return record;
  } catch (error) {
    throw new Error("Error creating medical record: " + error.message);
  }
};

export const getAllMedicalRecordsService = async () => {
  try {
    const records = await MedicalRecord.find().lean();

    return records.map((r) => ({
      ...r,
      petIdValue: r.petId ? r.petId : "N/A"
    }));
  } catch (error) {
    throw new Error("Error fetching medical records: " + error.message);
  }
};


export const getMedicalRecordByIdService = async (mid) => {
  try {
    return await MedicalRecord.findOne({ mid });
  } catch (error) {
    throw new Error("Error fetching medical record: " + error.message);
  }
};

export const updateMedicalRecordService = async (mid, updates) => {
  try {
    const updatedRecord = await MedicalRecord.findOneAndUpdate(
      { mid },
      updates,
      { new: true }
    ).lean();

    return updatedRecord;
  } catch (error) {
    throw new Error("Error updating medical record: " + error.message);
  }
};

export const deleteMedicalRecordService = async (mid) => {
  try {
    return await MedicalRecord.findOneAndDelete({ mid });
  } catch (error) {
    throw new Error("Error deleting medical record: " + error.message);
  }
};
