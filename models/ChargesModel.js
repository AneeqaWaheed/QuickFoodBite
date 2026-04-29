// models/chargesModel.js
import mongoose from "mongoose";

const chargesSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["delivery", "packaging"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Liquid", "Solid"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  
}, { timestamps: true });

export default mongoose.model("Charges", chargesSchema);