import mongoose from "mongoose";

const rescuedPetSchema = new mongoose.Schema(
  {
    rescuedPetId: { type: String, required: true, unique: true, maxlength: 4, match: [/^[A-Za-z0-9-]+$/, 'Invalid Pet ID'] }, 
    rescuedPetName: { type: String, required: true, minlength: 2, maxlength: 100, match: [/^[A-Za-z\s-]+$/, 'Invalid name'] },
    description: { type: String, required: true, minlength: 10, maxlength: 1000 },
    rescuedDate: { type: Date, required: true },
    rescuedPetAge: { type: Number, required: true, min: 0, max: 30 },
    rescuedPetGender: { type: String, enum: ["Male", "Female"], required: true },
    healthStatus: { type: String, enum: ["Healthy", "Injured", "Recovering"], required: true },
    adoptionStatus: { type: String, enum: ["Available", "Pending", "Adopted", "Unavailable", "Not for Adoption"], default: "Available" },
    imageUrl: { type: String, default: "" },
    
    // Foreign key reference to Vet
    vetId: { type: mongoose.Schema.Types.ObjectId, ref: "Vet" },

    // Status whether vet has confirmed or not
    isConfirmed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const RescuedPet = mongoose.model("RescuedPet", rescuedPetSchema);
export default RescuedPet;
