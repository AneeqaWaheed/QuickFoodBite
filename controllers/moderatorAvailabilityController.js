import ModeratorAvailability from "../models/moderatorAvailabilityModel.js";

// SAVE / UPDATE AVAILABILITY
export const saveAvailabilityController = async (req, res) => {
  try {
    const moderatorId = req.user._id;

    const { date, slots } = req.body;

    if (!date) {
      return res.status(400).send({
        success: false,
        message: "Date is required",
      });
    }

    if (!Array.isArray(slots)) {
      return res.status(400).send({
        success: false,
        message: "Slots must be an array",
      });
    }

    // Validate slots
    for (const slot of slots) {
      if (!slot.startTime || !slot.endTime) {
        return res.status(400).send({
          success: false,
          message: "Each slot must have start and end time",
        });
      }

      if (slot.startTime >= slot.endTime) {
        return res.status(400).send({
          success: false,
          message: "End time must be after start time",
        });
      }
    }

    // Check overlapping slots
    const sortedSlots = [...slots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    for (let i = 1; i < sortedSlots.length; i++) {
      const previous = sortedSlots[i - 1];
      const current = sortedSlots[i];

      if (current.startTime < previous.endTime) {
        return res.status(400).send({
          success: false,
          message: "Time slots cannot overlap",
        });
      }
    }

    const availability =
      await ModeratorAvailability.findOneAndUpdate(
        {
          moderatorId,
          date,
        },
        {
          moderatorId,
          date,
          slots,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    return res.status(200).send({
      success: true,
      message: "Availability saved successfully",
      availability,
    });
  } catch (error) {
    console.error("SAVE AVAILABILITY ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error saving availability",
      error: error.message,
    });
  }
};


// GET AVAILABILITY FOR A DATE
export const getAvailabilityController = async (req, res) => {
  try {
     console.log("✅ GET AVAILABILITY CONTROLLER HIT");
    console.log("Decoded user:", req.user);
    console.log("Moderator ID:", req.user?._id);
    console.log("Requested date:", req.params.date);
    const moderatorId = req.user._id;
    const { date } = req.params;

    const availability =
      await ModeratorAvailability.findOne({
        moderatorId,
        date,
      });

    return res.status(200).send({
      success: true,
      availability: availability || {
        date,
        slots: [],
      },
    });
  } catch (error) {
    console.error("GET AVAILABILITY ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error getting availability",
      error: error.message,
    });
  }
};


export const getAllModeratorAvailabilitiesController = async (req, res) => {
  try {
    const { date } = req.query;

    const filter = date ? { date } : {};

    const availabilities = await ModeratorAvailability.find(filter)
      .populate("moderatorId")
      .sort({ date: 1 });

    return res.status(200).send({
      success: true,
      count: availabilities.length,
      availabilities,
    });
  } catch (error) {
    console.error("GET ALL MODERATOR AVAILABILITIES ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error fetching moderator availabilities",
      error: error.message,
    });
  }
};
