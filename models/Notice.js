const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String },
  category: { type: String, enum: ["Holiday","Event","Meeting","Exam","Fees","General"], default: "General" },
  audience: { type: String, enum: ["All","Students","Teachers","Parents"], default: "All" },
  status:   { type: String, enum: ["Published","Draft"], default: "Published" },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);