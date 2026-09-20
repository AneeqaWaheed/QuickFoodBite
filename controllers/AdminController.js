import userModel from "../models/userModel.js";
// Suspend / Unsuspend user
export const toggleUserSuspensionController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow admin to suspend another admin
    if (user.role === 1) {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be suspended",
      });
    }

    user.isSuspended = !user.isSuspended;

    // Optional: if suspended, make moderator offline
    if (user.isSuspended) {
      user.isOnline = false;
      user.fcmToken = undefined;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isSuspended
        ? "User suspended successfully"
        : "User unsuspended successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error updating user suspension",
      error,
    });
  }
};

// Delete user
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow deleting admins
    if (user.role === 1) {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error,
    });
  }
};