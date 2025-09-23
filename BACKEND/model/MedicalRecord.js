import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    mid: { type: String, required: true, unique: true },
    dueDate: { type: Date, required: true },
    vaccination: { type: String, required: true },
    age: { type: Number, required: true },
    petId: { type: String, required: true },
    vetId: { type: String }
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
