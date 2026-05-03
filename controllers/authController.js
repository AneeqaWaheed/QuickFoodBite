import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import transport from "../config/nodemailer.js";
//registration
export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, studentId, phone, gender, email, password } = req.body;
    if (!firstName) {
      return res.send({ message: "FirstName is Required" });
    }
    if (!studentId) {
      return res.send({ message: "StudentId is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone number is Required" });
    }
    if (!gender) {
      return res.send({ message: "gender is Required" });
    }
    if (!email) {
      return res.send({ message: "email is Required" });
    }
    if (!password) {
      return res.send({ message: "password is Required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    const existingStudentId = await userModel.findOne({studentId});
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please login",
      });
    }
    if (existingStudentId) {
      return res.status(200).send({
        success: false,
        message: "You have registered with this Student Id, Please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      firstName,
      lastName,
      gender,
      email,
      studentId,
      phone,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};
//login

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered ",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Sucessfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: user.email,
        gender: user.gender,
        role: user.role,
        studentId: user.studentId,
        phone: user.phone,
        _id: user._id

      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};
//forgot password
export const testController = (req, res) => {
  res.send("Protected routes");
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).send({
        success: false,
        message: "Email is not registered ",
      });
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save();

    const resetUrl = `${process.env.REACT_ADDRESS}/reset-password/${user.resetPasswordToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transport.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("there was an error: ", err);
        return res.status(500).send({ message: "Error sending email" });
      }
      res
        .status(200)
        .send({ success: true, message: "Password reset link sent" });
    });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//update profile

export const updateProfileController = async (req, res) => {
  try {
    const { firstName, lastName, dob, gender, email, password } = req.body;
    const user = await userModel.findById(req.params.id);

    // Password
    if (password && password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        dob: dob || user.dob,
        gender: gender || user.gender,
        email: email || user.email,
        password: hashedPassword || user.password,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
      message: "Error while updating profile",
    });
  }
};
