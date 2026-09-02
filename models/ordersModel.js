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
    // =========================
    // CUSTOMER
    // =========================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },

    userName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // =========================
    // ORDER TYPE
    // =========================

    orderType: {
      type: String,
      enum: ["cafe", "service"],
      required: true,
      default: "cafe",
    },

    // =========================
    // CAFE
    // =========================

    items: {
      type: [itemSchema],
      default: [],
    },

    location: {
      type: String,
      default: "",
    },

    // =========================
    // OTHER SERVICES
    // =========================

    pickupPoint: {
      type: String,
      default: "",
    },

    deliveryPoint: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    specialNotes: {
      type: String,
      default: "",
    },

    // =========================
    // CHARGES
    // =========================

    subtotal: {
      type: Number,
      default: 0,
    },

    discountTotal: {
      type: Number,
      default: 0,
    },

    deliveryCharges: {
      type: Number,
      default: 0,
    },

    PackagingFee: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    // =========================
    // STATUS
    // =========================

    status: {
      type: String,
      enum: [
        "pending",
        "picked",
        "preparing",
        "purchasing",
        "on-the-way",
        "delivered",
        "cancelled",
        "expired",
      ],
      default: "pending",
    },

    // =========================
    // MODERATOR
    // =========================

    assignedModerator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    // =========================
    // CLAIM
    // =========================

    claimToken: {
      type: String,
      unique: true,
      sparse: true,
    },

    isClaimed: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    // =========================
    // ORDER UPDATES
    // =========================

    orderUpdates: [
      {
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },

        changes: [
          {
            type: {
              type: String,
              enum: [
                "added",
                "removed",
                "quantity_changed",
              ],
            },

            productName: String,

            oldQuantity: Number,

            newQuantity: Number,
          },
        ],

        oldSubtotal: Number,

        newSubtotal: Number,

        oldTotal: Number,

        newTotal: Number,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);