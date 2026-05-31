import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    dob: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    studentId: {
    type: String,
    required: true,
    unique: true,
  },

  phone: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    fcmToken: {
  type: String,
  default: null,
},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
