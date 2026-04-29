import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  minOrderPrice: { type: Number, default: 0 },
  globalDiscount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);