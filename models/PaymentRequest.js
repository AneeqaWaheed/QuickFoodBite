import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    totalEarnings: {
      type: Number,
      required: true,
    },

    adminFee: {
      type: Number,
      required: true,
    },

    receipt: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PaymentRequest", paymentRequestSchema);