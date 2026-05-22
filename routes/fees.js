const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const Fee     = require("../models/Fee");
const Student = require("../models/Student");

// Get all fees (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const fees = await Fee.find().populate("student","name rollNo class image");
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my fees (student)
router.get("/me", protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const fees = await Fee.find({ student: student._id }).sort("-createdAt");
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add fee (admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update fee
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fee);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete fee
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;