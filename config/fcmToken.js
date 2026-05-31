import userModel from "../models/userModel.js";

export const saveFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    console.log("📩 Incoming request:");
    console.log("userId:", userId);
    console.log("fcmToken:", fcmToken);

    const user = await userModel.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true }
    );

    console.log("✅ Updated user:", user);

    res.status(200).send({
      success: true,
      message: "FCM token saved",
    });
  } catch (error) {
    console.log("❌ FCM SAVE ERROR =================");
    console.log(error); // 👈 THIS is the important one

    res.status(500).send({
      success: false,
      message: "Server error saving FCM token",
      error: error.message, // 👈 send readable error
    });
  }
};