import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  console.log("register api funtion ahs been called");
  console.log("request boyd is", req.body);
  try {
    const { name, phoneNumber, email, password, confirmPassword } = req.body;
    if (!name || !phoneNumber || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "please enter all the fields" });
    }
    if (confirmPassword !== password) {
      return res.status(400).json({ msg: "both password should match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "email is already exits" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(req.body.password.toString(), salt);
    console.log("Hased Password", hash);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    console.log("new Data is", newUser);
    const savedUser = await newUser.save();
    res.json({ status: true, msg: "user has been created", user: savedUser });
  } catch (error) {
    console.log("Error is", error.message);
  }
};

export const login = async (req, res) => {
  console.log("login api has been called");
  console.log("email is", req.body.email);
  console.log("password is", req.body.password);
  try {
    const { email } = req.body;
    if (!email || !req.body.password) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ msg: "User with this email does not exist" });
    }
    console.log("user is", user);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send({ msg: "Incorrect password." });
    }
    console.log("password is ", validPassword);
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
    const { password, ...loggedUser } = user._doc;
    console.log("logged user is", loggedUser);
    return res.json({
      status: true,
      message: "login sucessfully",
      loggedUser: loggedUser,
    });
  } catch (err) {
    console.log("error is", err);
  }
};

export const forgotPassword = async (req, res) => {
  console.log("forgot password api has been called");
  console.log("request body is", req.body);
  const { email } = req.body;
  console.log("email is", email);
  if (!email) {
    res.status(400).json({ msg: "please enter email" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ msg: "User not registered" });
    }
    console.log("user is", user);
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "1h",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sanjanapanwar2002@gmail.com",
        pass: "jkmm uuhz aqxj mmjr",
      },
    });

    var mailOptions = {
      from: "sanjanapanwar2002@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:3000/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ message: "error sending email" });
      } else {
        res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log("Error is", err);
  }
};

export const resetPassword = async (req, res) => {
  console.log("reset password api has been called");
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log("token is", token);
  console.log("password is", password, "confirm password is", confirmPassword);

  try {
    console.log("before verify");
    console.log("key is", process.env.KEY);
    const decoded = await jwt.verify(token, process.env.KEY);
    console.log("after verify");
    console.log("decode is", decoded);
    const id = decoded.id;
    const hasedPasswrod = await bcrypt.hash(password.toString(), 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hasedPasswrod });
    return res.json({ status: true, message: "update password" });
  } catch (err) {
    console.log("error is", err);
  }
};

export const chnagePassword = async (req, res) => {
  console.log("change password api has been called");
  const id = req.params.id;
  console.log("id is", id);
  const data = req.body;
  const { oldPassword, newPassword, confirmPassword } = data;
  console.log("oldpassword", oldPassword);
  console.log("new password", newPassword);
  console.log("confirm password ", confirmPassword);
  try {
    const user = await User.findById({ _id: id });
    console.log("user is", user);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ msg: "old passwrod is incorrect" });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ msg: "new password and confirm password should match" });
    }
    const salt = bcrypt.genSaltSync(10);
    const newHashedPassword = await bcrypt.hash(
      req.body.newPassword.toString(),
      salt
    );
    console.log("Hased Password", newHashedPassword);
    const updatedLoggedUser = await User.findByIdAndUpdate(
      { _id: id },
      { password: newHashedPassword }
    );
    return res
      .status(200)
      .json({ msg: "password changes sucessfully", updatedLoggedUser });
  } catch (err) {
    console.log("error is", err);
  }
};

export const updateAdminProfile = async (req, res) => {
  console.log("update admin profile api called");
  const id = req.params.id;
  console.log("id is", id);
  const data = req.body;
  console.log("data is", data);
  try {
    const updatedLoggedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true,msg: "updated successfully", updatedLoggedUser });
  } catch (err) {
    console.log("err is", err);
  }
};
