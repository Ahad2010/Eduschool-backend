const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const createAdmin = async (req, res) => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) return res.status(400).json({ message: "Admin already exists" });
    const admin = await User.create({
      name: "Admin", email: "admin@eduschool.com",
      password: "admin123", role: "admin", status: "approved",
    });
    res.status(201).json({ message: "Admin created ✅", email: admin.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, class: cls, phone, subject, qualification } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role: role==="admin"?"student":role, status:"pending" });
    if (role === "student") {
      const student = await Student.create({ user:user._id, name, email, class:cls||"", phone:phone||"" });
      await User.findByIdAndUpdate(user._id, { profileId:student._id, profileModel:"Student" });
    } else if (role === "teacher") {
      const teacher = await Teacher.create({ user:user._id, name, email, phone:phone||"", subject:subject||"", qualification:qualification||"" });
      await User.findByIdAndUpdate(user._id, { profileId:teacher._id, profileModel:"Teacher" });
    }
    res.status(201).json({ message: "Registration successful! Waiting for admin approval.", status:"pending" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status === "pending")  return res.status(403).json({ message: "Account pending admin approval" });
    if (user.status === "rejected") return res.status(403).json({ message: "Account rejected by admin" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    let profile = null;
    if (user.role === "student") profile = await Student.findOne({ user: user._id });
    if (user.role === "teacher") profile = await Teacher.findOne({ user: user._id });
    res.json({
      token: generateToken(user._id),
      user: { id:user._id, name:user.name, email:user.email, role:user.role, image:user.image, status:user.status, profile },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    let profile = null;
    if (user.role === "student") profile = await Student.findOne({ user: user._id });
    if (user.role === "teacher") profile = await Teacher.findOne({ user: user._id });
    res.json({ user, profile });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status:"pending" }).select("-password").sort("-createdAt");
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const approveUser = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved","rejected"].includes(status))
      return res.status(400).json({ message: "Status must be approved or rejected" });
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new:true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${status} successfully`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { image:imageUrl }, { new:true }).select("-password");
    res.json({ message: "Image updated", image:imageUrl, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createAdmin, register, login, getMe, getPendingUsers, approveUser, updateImage, changePassword };