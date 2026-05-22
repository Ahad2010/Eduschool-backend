const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  rollNo:    { type: String },
  class:     { type: String, required: true },
  section:   { type: String, default: "A" },
  phone:     { type: String },
  dob:       { type: String },
  address:   { type: String },
  blood:     { type: String },
  image:     { type: String, default: "" },
  admNo:     { type: String },
  status:    { type: String, enum: ["active", "inactive"], default: "active" },

  // Parent info
  parentName:  { type: String },
  parentPhone: { type: String },
  parentEmail: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);