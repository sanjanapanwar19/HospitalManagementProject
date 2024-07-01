import express from "express";
import {
  addStaff,
  deleteStaffById,
  updateStaffById,
  viewAllStaff,
} from "../controllers/staff.js";

const router = express();

router.post("/addStaff", addStaff);
router.get("/viewAllStaff", viewAllStaff);
router.put("/updateStaffById/:id", updateStaffById);
router.delete("/deleteStaffById/:id", deleteStaffById);

export default router;
