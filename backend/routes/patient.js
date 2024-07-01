import express from "express";
import {
  addPatient,
  deletePatientById,
  updatePatientById,
  viewAllPatient,
} from "../controllers/patient.js";
const router = express();

router.post("/addPatient", addPatient);
router.get("/viewAllPatient", viewAllPatient);
router.put("/updatePatientById/:id", updatePatientById);
router.delete("/deletePatientById/:id", deletePatientById);

export default router;
