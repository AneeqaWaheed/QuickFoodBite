// utils/initCharges.js
import Charges from "../models/ChargesModel.js"

export const initCharges = async () => {
  const defaults = [
    { type: "delivery", category: "Liquid", amount: 0 },
    { type: "delivery", category: "Solid", amount: 0 },
    { type: "packaging", category: "Liquid", amount: 0 },
    { type: "packaging", category: "Solid", amount: 0 },
  ];

  for (let item of defaults) {
    const exists = await Charges.findOne({
      type: item.type,
      category: item.category,
    });

    if (!exists) {
      await new Charges(item).save();
    }
  }

  console.log("Default charges initialized ✅");
};