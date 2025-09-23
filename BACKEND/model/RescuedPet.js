import mongoose from "mongoose";

const rescuedPetSchema = new mongoose.Schema(
  {
    rescuedPetId: { type: String, required: true, unique: true }, 
    rescuedPetName: { type: String, required: true },
    description: { type: String, required: true },
    rescuedDate: { type: Date, required: true },
    rescuedPetAge: { type: Number, required: true },
    rescuedPetGender: { type: String, enum: ["Male", "Female"], required: true },
    
    // Foreign key reference to Vet
    vetId: { type: mongoose.Schema.Types.ObjectId, ref: "Vet" },

    // Status whether vet has confirmed or not
    isConfirmed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const RescuedPet = mongoose.model("RescuedPet", rescuedPetSchema);
export default RescuedPet;
