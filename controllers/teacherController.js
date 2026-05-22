const Teacher = require("../models/Teacher");
const User    = require("../models/User");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("user","name email status image");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) return res.status(404).json({ message: "Profile not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, subject, qualification, experience, address } = req.body;
    const update = { name, phone, subject, qualification, experience, address };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const teacher = await Teacher.findOneAndUpdate({ user: req.user._id }, update, { new: true });
    if (name) await User.findByIdAndUpdate(req.user._id, { name });
    res.json({ message: "Profile updated", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher updated", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    await User.findByIdAndDelete(teacher.user);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllTeachers, getMyProfile, updateMyProfile, updateTeacher, deleteTeacher };