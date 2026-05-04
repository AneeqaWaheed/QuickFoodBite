import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  quantity: Number,
  price: Number,
  category: String,
  type: String,
  discount: Number,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },

    // 🔥 FIX HERE
    items: [itemSchema],

    subtotal: Number,
    discountTotal: Number,
    total: Number,
    deliveryCharges: Number,
    PackagingFee: Number,
    userName: String,
    phone: String,
    location: String,

    status: {
      type: String,
      enum: ["pending", "picked", "delivered", "cancelled"],
      default: "pending",
    },

    assignedModerator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
     // ✅ NEW FIELD (IMPORTANT)
    claimToken: {
      type: String,
      unique: true,
    },

    // ✅ OPTIONAL (for expiry logic later)
    isClaimed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
  type: Date,
},
  },
  { timestamps: true }
);
// 🔥 FIX MODEL CACHING ISSUE
export default mongoose.models.Order || mongoose.model("Order", orderSchema);