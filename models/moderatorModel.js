import mongoose from "mongoose";
const moderatorSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  phone: String,
  password: String
});

export default mongoose.model("Moderator", moderatorSchema);