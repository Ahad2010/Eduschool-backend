const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const Notice  = require("../models/Notice");

// Get all notices (all logged in users)
router.get("/", protect, async (req, res) => {
  try {
    const notices = await Notice.find({ status:"Published" }).sort("-createdAt");
    res.json(notices);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all (admin — including drafts)
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const notices = await Notice.find().sort("-createdAt");
    res.json(notices);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add notice (admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(notice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(notice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;