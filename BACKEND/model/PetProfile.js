import mongoose from "mongoose";
import cloudinary from "cloudinary";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

const petProfileSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    petSpecies: {
      type: String,
      required: true,
      enum: ["Dog", "Cat"],
    },
    petBreed: {
      type: String,
      trim: true,
    },
    petAge: {
      type: Number,
      min: 0,
    },
    petGender: {
      type: String,
      enum: ["Male", "Female"],
    },
    petStatus: {
      type: String,
      enum: ["Available", "Adopted", "Pending"],
      default: "Available",
    },
    petOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    petDescription: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: "", // will be set dynamically
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Pre-save middleware
petProfileSchema.pre("save", async function (next) {
  try {
    // If imageUrl is already set (user uploaded) → skip
    if (this.imageUrl) return next();

    // Assign a random image based on species
    const dogImages = [
      "https://res.cloudinary.com/demo/image/upload/dog1.jpg",
      "https://res.cloudinary.com/demo/image/upload/dog2.jpg",
      "https://res.cloudinary.com/demo/image/upload/dog3.jpg",
    ];
    const catImages = [
      "https://res.cloudinary.com/demo/image/upload/cat1.jpg",
      "https://res.cloudinary.com/demo/image/upload/cat2.jpg",
      "https://res.cloudinary.com/demo/image/upload/cat3.jpg",
    ];

    if (this.petSpecies === "Dog") {
      this.imageUrl = dogImages[Math.floor(Math.random() * dogImages.length)];
    } else if (this.petSpecies === "Cat") {
      this.imageUrl = catImages[Math.floor(Math.random() * catImages.length)];
    } else {
      this.imageUrl = "https://placehold.co/600x400?text=Pet+Image";
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("PetProfile", petProfileSchema);
