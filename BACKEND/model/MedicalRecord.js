import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    mid: {type: String, required: true, unique: true},
    animalId: { type: String, required: true },
    animalName: { type: String, required: true },
    species: { type: String, enum: ["Dog", "Cat"], required: true },
    breed: { type: String },
    sex: { type: String, enum: ["Male", "Female"], required: true },
    dateOfBirth: { type: Date },

    dateOfExamination: { type: Date, required: true },
    reasonForExamination: { type: String },
    pastMedicalHistory: { type: String },
    vaccinationStatus: { type: [String] },

    vitalSigns: {
      temperature: { type: Number },
      pulse: { type: Number },
      respirationRate: { type: Number },
      bodyConditionScore: { type: Number },
    },
    diagnosis: {type: String},
    fitForAdoption: {
      status: { type: Boolean, default: false },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;

