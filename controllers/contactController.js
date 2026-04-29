import contactModel from "../models/contactModel.js";
import nodemailer from "nodemailer";
export const contactController = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Save to MongoDB
    const newContact = new contactModel({ name, email, message });
    // console.log("newContact ", newContact);
    await newContact.save();

    // Nodemailer Setup
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`, // Replace with your email
        pass: `${process.env.EMAIL_PASSWORD}`, // Replace with your email password
      },
    });

    // Email Options
    let mailOptions = {
      from: email,
      to: `${process.env.EMAIL}`, // Your receiving email
      subject: `Contact Form`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error in contactController:", err);
    res.status(500).json({ message: "Failed to send message", error: err });
  }
};
