const Student = require("../models/Student");
const User    = require("../models/User");

// GET all students (admin/teacher)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user","name email status image").sort("-createdAt");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET students by class (teacher)
const getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.class }).populate("user","name email image");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single student
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("user","name email image status");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET my profile (student)
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: "Profile not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE my profile (student)
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address, parentName, parentPhone, parentEmail } = req.body;
    const update = { name, phone, address, parentName, parentPhone, parentEmail };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    const student = await Student.findOneAndUpdate(
      { user: req.user._id },
      update,
      { new: true }
    );
    // Update name in User too
    if (name) await User.findByIdAndUpdate(req.user._id, { name });
    res.json({ message: "Profile updated", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE student (admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE student (admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    await User.findByIdAndDelete(student.user);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllStudents, getStudentsByClass, getStudent, getMyProfile, updateMyProfile, updateStudent, deleteStudent };