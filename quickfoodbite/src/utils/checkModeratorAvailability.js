import ModeratorAvailability from "../models/moderatorAvailabilityModel.js";

export const isModeratorAvailableNow = async (
  moderatorId,
  date,
  currentTime
) => {
  try {
    const availability =
      await ModeratorAvailability.findOne({
        moderatorId,
        date,
      });

    if (!availability) {
      return false;
    }

    const availableSlot = availability.slots.find(
      (slot) => {
        if (!slot.isAvailable) {
          return false;
        }

        return (
          currentTime >= slot.startTime &&
          currentTime < slot.endTime
        );
      }
    );

    return !!availableSlot;
  } catch (error) {
    console.error(
      "AVAILABILITY CHECK ERROR:",
      error
    );

    return false;
  }
};