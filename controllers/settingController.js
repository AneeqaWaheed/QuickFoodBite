// controllers/deliveryController.js
import Settings from "../models/SettingSchema.js";

// CREATE new setting
// export const createDeliveryCharges = async (req, res) => {
//   try {
//     const { type, deliveryCharge } = req.body;

//     const existing = await DeliveryCharges.findOne({ type });
//     if (existing) return res.status(400).json({ message: "Type already exists" });

//     const setting = await DeliveryCharges.create({ type, deliveryCharge });
//     res.status(201).json(setting);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // READ all settings
// export const getAllDeliveryCharges = async (req, res) => {
//   try {
//     const settings = await DeliveryCharges.find();
//     res.json(settings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // READ single setting
// export const getDeliveryCharges = async (req, res) => {
//   try {
//     const setting = await DeliveryCharges.findById(req.params.id);
//     if (!setting) return res.status(404).json({ message: "Not found" });
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // UPDATE setting
// export const updateDeliveryCharges = async (req, res) => {
//   try {
//     const { deliveryCharge } = req.body;
//     const setting = await DeliveryCharges.findById(req.params.id);
//     if (!setting) return res.status(404).json({ message: "Not found" });

//     setting.deliveryCharge = deliveryCharge;
//     await setting.save();

//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // DELETE setting
// export const deleteDeliveryCharge = async (req, res) => {
//   try {
//     const setting = await DeliveryCharges.findByIdAndDelete(req.params.id);
//     if (!setting) return res.status(404).json({ message: "Not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},                // 👈 finds the single document
      req.body,         // 👈 updates minOrderPrice + globalDiscount
      {
        new: true,      // return updated document
        upsert: true    // create if doesn't exist
      }
    );

    res.status(200).json({
      success: true,
      settings,
      message: "Settings updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating settings"
    });
  }
};
export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};