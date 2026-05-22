const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher:   { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  class:     { type: String, required: true },
  date:      { type: String, required: true }, // "2025-05-21"
  status:    { type: String, enum: ["Present", "Absent", "Late"], default: "Present" },
  time:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);