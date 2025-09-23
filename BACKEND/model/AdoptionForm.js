import mongoose from "mongoose";

const adoptionFormSchema = new mongoose.Schema(
  {
    adopterName: { type: String, required: true, trim: true },
    adopterEmail: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true, 
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"] 
    },
    adopterPhone: { 
      type: String, 
      required: true, 
      trim: true,
      match: [/^\d{10}$/, "Invalid phone number"] 
    },
    adopterAddress: { type: String, required: true, trim: true },
    reasonForAdoption: { type: String, required: true, trim: true },

    petId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PetProfile", 
      required: true 
    },

    formStatus: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    },
  },
  {
    timestamps: true,
  }
);

// Optional: indexes for faster queries
adoptionFormSchema.index({ petId: 1 });
adoptionFormSchema.index({ formStatus: 1 });

const AdoptionForm = mongoose.model("AdoptionForm", adoptionFormSchema);
export default AdoptionForm;
