import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, unique: true },

    time: { type: String, required: true, match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    date: { type: Date, required: true },
    vetId: { type: String, required: true },
    owner: {
      fullName: { type: String, required: true, trim: true },
      phoneNumber: { type: String, required: true },
    },

    pet: {
      name: { type: String, required: true },
      species: { type: String, required: true, enum: ["Dog", "Cat"] },
      dob: { type: Date, required: true },
      gender: { type: String, required: true, enum: ["Male", "Female", "Neutered", "Spayed"] },
      medicalHistory: { type: String, default: "" },
    },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;

