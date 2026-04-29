import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
   
    price: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
 type: {
    type: String,
    enum: ["Liquid", "Solid"],
    required: true,
  },
  discount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
  
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
