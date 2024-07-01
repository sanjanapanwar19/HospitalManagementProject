import Staff from "../models/StaffModel.js";
import { login } from "./auth.js";

export const addStaff = async (req, res) => {
  console.log("add staff api has been called");
  console.log("request body is", req.body);
  try {
    const {
      role,
      fullName,
      email,
      dob,
      contactNumber,
      specialization,
      gender,
      description,
    } = req.body;
    if (
      !role ||
      !fullName ||
      !email ||
      !dob ||
      !contactNumber ||
      !specialization ||
      !gender ||
      !description
    ) {
      return res.status(400).json({ msg: "please enter all the fields" });
    }
    const newStaffMember = new Staff({
      ...req.body,
    });
    console.log("new data in the staff member is", newStaffMember);
    const savedStaffMember = await newStaffMember.save();
    return res.json({
      status: true,
      msg: "staff has been addres",
      staffMember: savedStaffMember,
    });
  } catch (err) {
    console.log("err is", err);
  }
};

export const viewAllStaff = async (req, res) => {
  console.log("view staff api has been called");
  try {
    const allStaff = await Staff.find();
    console.log("all staff ", allStaff);
    // if (allStaff.length === 0) {
    //   return res.status(400).json({ msg: "No staff members found" });
    // }
    return res
      .status(200)
      .json({ msg: "successfully accessed sraff members", allStaff });
  } catch (err) {
    console.log("Error is", err);
  }
};

export const updateStaffById = async (req, res) => {
  console.log("updata staff by id  api called");
  console.log(req.params.id);
  console.log("body", req.body);
  const id = req.params.id;
  const data = req.body;
  try {
    const updatedStaffMember = await Staff.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, msg: "updated successfully", updatedStaffMember });
  } catch (err) {
    console.log("err is", err);
  }
};
export const deleteStaffById = async (req, res) => {
  console.log("delete staff by id api called");
  const id = req.params.id;
  console.log("id is", id);
  try {
    const deletedStaffMember = await Staff.findByIdAndDelete({ _id: id });
    res
      .status(200)
      .json({ msg: "staff member deleted sucessfully", deletedStaffMember });
  } catch (err) {
    console.log("error is", err);
  }
};
