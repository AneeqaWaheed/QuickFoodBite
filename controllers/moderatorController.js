import Moderator from "../models/Moderator.js";
import jwt from "jsonwebtoken";

export const loginModerator = async (req, res) => {
  const user = await Moderator.findOne({
    studentId: req.body.studentId,
    password: req.body.password
  });

  if (!user) return res.status(401).json({ message: "Invalid" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ user, token });
};