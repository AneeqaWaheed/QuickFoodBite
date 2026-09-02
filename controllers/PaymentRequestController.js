import PaymentRequest from "../models/PaymentRequest.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
export const submitPaymentRequest = async (req, res) => {
  try {
    const moderatorId = req.user._id;

    const moderator = await userModel.findById(moderatorId);

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    // Check pending payment
    const existingRequest = await PaymentRequest.findOne({
      moderator: moderatorId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).send({
        success: false,
        message: "You already have a pending payment request.",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Payment receipt is required",
      });
    }

    const totalEarnings = moderator.creditBalance || 0;
    const adminFee = totalEarnings * 0.2;

    // Upload receipt to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "QuickFoodBite/payment-receipts",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Save payment request
    const paymentRequest = await PaymentRequest.create({
      moderator: moderatorId,
      totalEarnings,
      adminFee,
      receipt: uploadResult.secure_url,
    });

    res.status(201).send({
      success: true,
      message: "Payment request submitted successfully",
      paymentRequest,
    });

  } catch (error) {
    console.log("PAYMENT REQUEST ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error submitting payment request",
    });
  }
};
export const getPaymentRequests = async (req, res) => {
  try {
    const requests = await PaymentRequest.find()
      .populate(
        "moderator",
        "firstName lastName email studentID creditBalance"
      )
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      requests,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error fetching payment requests",
    });
  }
};

export const approvePaymentRequest = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentRequest = await PaymentRequest.findById(paymentId);

    if (!paymentRequest) {
      return res.status(404).send({
        success: false,
        message: "Payment request not found",
      });
    }

    if (paymentRequest.status !== "pending") {
      return res.status(400).send({
        success: false,
        message: "This payment request has already been processed",
      });
    }

    // Update payment status
    paymentRequest.status = "approved";

    await paymentRequest.save();

    // Reset moderator credits
    await userModel.findByIdAndUpdate(
      paymentRequest.moderator,
      {
        creditBalance: 0,
      }
    );

    res.status(200).send({
      success: true,
      message: "Payment approved and moderator credits reset",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error approving payment",
    });
  }
};

export const rejectPaymentRequest = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentRequest = await PaymentRequest.findByIdAndUpdate(
      paymentId,
      {
        status: "rejected",
      },
      { new: true }
    );

    if (!paymentRequest) {
      return res.status(404).send({
        success: false,
        message: "Payment request not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Payment request rejected",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error rejecting payment request",
    });
  }
};

export const updateModeratorCredits = async (req, res) => {
  try {
    const { moderatorId } = req.params;
    const { creditBalance } = req.body;

    if (creditBalance === undefined || creditBalance < 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid credit balance",
      });
    }

    const moderator = await userModel.findByIdAndUpdate(
      moderatorId,
      {
        creditBalance: Number(creditBalance),
      },
      { new: true }
    );

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Credits updated successfully",
      creditBalance: moderator.creditBalance,
    });

  } catch (error) {
    console.log("UPDATE CREDITS ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error updating credits",
    });
  }
};