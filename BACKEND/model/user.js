import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Auto-incrementing numeric userID
    userID: {
      type: String,
      unique: true,
      sparse: true, // allows existing docs without userID
      index: true,
    },
    name: {
      type: String,
      required: [true, "Provide Name"],
    },
    email: {
      type: String,
      required: [true, "Provide Email"],
      unique: true,
      index: true, 
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number, 
      default: null,
    },
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: null, 
    },
    refresh_token: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "VET", "ADMIN"],
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: null, 
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],
    orderhistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
  },
  { timestamps: true }
);

// Auto-increment userID using a counters collection
// This runs only on new documents if userID is not already set
userSchema.pre("save", async function (next) {
  if (!this.isNew || this.userID != null) return next();
  try {
    const counters = this.$model ? this.$model("__dummy__").db.collection("counters") : mongoose.connection.collection("counters");
    const result = await counters.findOneAndUpdate(
      { _id: "users" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
    const seq = result?.value?.seq || 1;
    this.userID = seq;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("user", userSchema);
