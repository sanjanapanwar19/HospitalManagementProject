import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  chnagePassword,
  updateAdminProfile,
} from "../controllers/auth.js";
import auth from "../middleware/auth.js";
const router = express();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.put("/changePassword/:id", chnagePassword);
router.put("/updateAdminProfile/:id", updateAdminProfile);
export default router;
