import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import authRoute from "./routes/auth.js";
import staffRoute from "./routes/staff.js";
import patientRoute from "./routes/patient.js";
dotenv.config();
//mongodb+srv://Sanjanapanwar:sanjanapanwar%4019@cluster0.bminxen.mongodb.net/HospitalDatabase?retryWrites=true&w=majority

const PORT = 4000;
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,POST,DELETE",
  })
);

app.use(bodyParser.json());
const connectDB = async () => {
  try {
    const connection = mongoose.connect(
      "mongodb+srv://Sanjanapanwar:sanjanapanwar%4019@cluster0.bminxen.mongodb.net/HospitalDatabase?retryWrites=true&w=majority",
      {}
    );
    console.log("connected");
  } catch (err) {
    console.log("err");
  }
};
connectDB();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/staff", staffRoute);
app.use("/api/patient", patientRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
