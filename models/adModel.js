import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
   
    image: {
      type: String,
      required: true,
    },

    buttonText: {
      type: String,
      default: "",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ad", adSchema);