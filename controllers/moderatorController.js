import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const loginModerator = async (req, res) => {
  try {
    const user = await userModel.findOne({
      studentId: req.body.studentId,
      password: req.body.password,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      user,
      token,
    });

  } catch (error) {
    console.log("LOGIN MODERATOR ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


// ===============================
// GO ONLINE / GO OFFLINE
// ===============================
export const toggleModeratorStatus = async (req, res) => {
  try {
    const { userId, isOnline } = req.body;

    const moderator = await userModel.findByIdAndUpdate(
      userId,
      {
        isOnline,
        lastSeen: isOnline ? new Date() : null,
      },
      { new: true }
    );

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: isOnline
        ? "You are now online"
        : "You are now offline",
      isOnline: moderator.isOnline,
    });

  } catch (error) {
    console.log("TOGGLE ONLINE ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error updating online status",
    });
  }
};


// ===============================
// GET MODERATOR STATUS
// ===============================
export const getModeratorStatusController = async (req, res) => {
  try {
    const { userId } = req.params;

    const moderator = await userModel.findById(userId);

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    return res.status(200).send({
      success: true,
      isOnline: moderator.isOnline || false,
    });

  } catch (error) {
    console.log("GET MODERATOR STATUS ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Unable to get moderator status",
    });
  }
};