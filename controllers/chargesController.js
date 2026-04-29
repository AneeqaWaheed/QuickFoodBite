// controllers/chargesController.js
import Charges from "../models/ChargesModel.js";

// CREATE
export const updateCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).send({
        success: false,
        message: "Amount is required",
      });
    }

    const updated = await Charges.findByIdAndUpdate(
      id,
      { amount },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Charge updated",
      updated,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false });
  }
};
// GET ALL
export const getCharges = async (req, res) => {
  const charges = await Charges.find();
  res.send({ success: true, charges });
};

