import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  slots: [
    {
      time: { type: String, required: true },
      isAvailable: { type: Boolean, default: true },
    },
  ],
});

const vetSchema = new mongoose.Schema(
  {
    vetId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    contactNo: { type: [String], required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    availability: { type: [timeSlotSchema], default: [] },
  },
  { timestamps: true }
);

const Vet = mongoose.model("Vet", vetSchema);
export default Vet;
