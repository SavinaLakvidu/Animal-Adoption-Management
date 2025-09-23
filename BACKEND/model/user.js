import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userID: { type: String, unique: true },
    userDob: { type: Date, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userAddress: { type: String, required: true },
    userPhone: { type: String, required: true },
    userPassword: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["guest", "adopter", "donor", "volunteer","vet"], 
      default: "guest" 
    }
  },
  { timestamps: true }
);

// ✅ Auto-generate custom userID if not provided
userSchema.pre("save", function(next) {
  if (!this.userID) {
    this.userID = `USER-${Date.now()}`;
  }
  next();
});

// ✅ Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("userPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
  next();
});

// ✅ Password verification method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.userPassword);
};

// ✅ DOB validation
userSchema.path("userDob").validate(function(value) {
  return value < new Date();
}, "Date of birth cannot be in the future.");

// ✅ Email format validation
userSchema.path("userEmail").validate(function(value) {
  return /\S+@\S+\.\S+/.test(value);
}, "Invalid email format.");

export default mongoose.model("User", userSchema);
