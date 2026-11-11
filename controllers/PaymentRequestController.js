
import PaymentRequest from "../models/PaymentRequest.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

const MINIMUM_DEPOSIT = 100;

// Submit deposit request
export const submitPaymentRequest = async (req, res) => {
  try {
    const moderatorId = req.user._id;
    const amount = Number(req.body.amount);

    const moderator = await userModel.findById(moderatorId);

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    // Validate deposit amount
    if (!Number.isFinite(amount) || amount < MINIMUM_DEPOSIT) {
      return res.status(400).send({
        success: false,
        message: "Minimum deposit amount is Rs. 100",
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
        message: "You already have a pending deposit request.",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Payment receipt is required",
      });
    }

    // Upload receipt to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "QuickFoodBite/payment-receipts",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Save deposit request
    const paymentRequest = await PaymentRequest.create({
      moderator: moderatorId,
      amount,
      receipt: uploadResult.secure_url,
      status: "pending",
    });

    res.status(201).send({
      success: true,
      message: "Deposit request submitted successfully",
      paymentRequest,
    });

  } catch (error) {
    console.log("PAYMENT REQUEST ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error submitting deposit request",
    });
  }
};


// Get all payment requests
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
    console.log("GET PAYMENT REQUESTS ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error fetching payment requests",
    });
  }
};


// Approve deposit request
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
        message: "This request has already been processed",
      });
    }

    // Add deposit amount to existing credits
    const moderator = await userModel.findByIdAndUpdate(
      paymentRequest.moderator,
      {
        $inc: {
          creditBalance: paymentRequest.amount,
        },
      },
      { new: true }
    );

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    paymentRequest.status = "approved";
    paymentRequest.approvedAt = new Date();

    await paymentRequest.save();

    res.status(200).send({
      success: true,
      message: "Deposit approved and credits added successfully",
      creditBalance: moderator.creditBalance,
    });

  } catch (error) {
    console.log("APPROVE PAYMENT ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error approving deposit",
    });
  }
};


// Reject deposit request
export const rejectPaymentRequest = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentRequest = await PaymentRequest.findOneAndUpdate(
      {
        _id: paymentId,
        status: "pending",
      },
      {
        status: "rejected",
      },
      { new: true }
    );

    if (!paymentRequest) {
      return res.status(400).send({
        success: false,
        message: "Request not found or already processed",
      });
    }

    res.status(200).send({
      success: true,
      message: "Deposit request rejected",
    });

  } catch (error) {
    console.log("REJECT PAYMENT ERROR:", error);

    res.status(500).send({
      success: false,
      message: "Error rejecting deposit request",
    });
  }
};


// Manually update moderator credits (admin)
export const updateModeratorCredits = async (req, res) => {
  try {
    const { moderatorId } = req.params;
    const { creditBalance } = req.body;

    const amount = Number(creditBalance);

    if (
      creditBalance === undefined ||
      !Number.isFinite(amount)
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid credit balance",
      });
    }

    const moderator = await userModel.findByIdAndUpdate(
      moderatorId,
      {
        creditBalance: amount,
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
