const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:          { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String },
  subject:       { type: String },
  qualification: { type: String },
  experience:    { type: String },
  address:       { type: String },
  image:         { type: String, default: "" },
  classes:       [{ type: String }], // ["10-A", "9-B"]
  status:        { type: String, enum: ["active", "inactive", "on_leave"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);