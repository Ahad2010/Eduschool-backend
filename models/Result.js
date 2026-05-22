const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher:  { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  class:    { type: String, required: true },
  exam:     { type: String, default: "Annual Exam 2025" },
  subjects: [{
    name:      { type: String },
    obtained:  { type: Number, default: 0 },
    total:     { type: Number, default: 100 },
  }],
  totalMarks:    { type: Number, default: 0 },
  obtainedMarks: { type: Number, default: 0 },
  percentage:    { type: Number, default: 0 },
  grade:         { type: String },
  remarks:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);