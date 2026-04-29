import express from "express";
import {
  registerController,
  LoginController,
  testController,
  forgotPassword,
  resetPassword,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";
//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", LoginController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected  User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/all-users", requireSignIn, isAdmin, getAllUsers);

//update profile

router.put("/update-profile/:id", requireSignIn, updateProfileController);

export default router;
