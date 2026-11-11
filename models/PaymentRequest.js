
import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema(
  {
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 100,
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

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "PaymentRequest",
  paymentRequestSchema
);
