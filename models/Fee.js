const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  student:    { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  class:      { type: String },
  month:      { type: String },
  totalAmount:{ type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  dueAmount:  { type: Number, default: 0 },
  status:     { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Unpaid" },
  paidDate:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Fee", feeSchema);