import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const moderatorAvailabilitySchema = new mongoose.Schema(
  {
    moderatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // Example: "2026-10-06"
    date: {
      type: String,
      required: true,
    },

    slots: {
      type: [timeSlotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

moderatorAvailabilitySchema.index(
  { moderatorId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model(
  "ModeratorAvailability",
  moderatorAvailabilitySchema
);