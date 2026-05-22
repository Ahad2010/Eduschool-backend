const Attendance = require("../models/Attendance");
const Student    = require("../models/Student");

// Mark attendance (teacher)
const markAttendance = async (req, res) => {
  try {
    const { records, date, class: cls } = req.body;
    // records = [{ studentId, status, time }]
    const results = [];
    for (const rec of records) {
      const att = await Attendance.findOneAndUpdate(
        { student: rec.studentId, date, class: cls },
        { status: rec.status, time: rec.time, teacher: req.user._id },
        { upsert: true, new: true }
      );
      results.push(att);
    }
    res.json({ message: "Attendance marked", results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get attendance by class + date
const getAttendanceByClass = async (req, res) => {
  try {
    const { class: cls, date } = req.query;
    const filter = {};
    if (cls)  filter.class = cls;
    if (date) filter.date  = date;
    const attendance = await Attendance.find(filter).populate("student","name rollNo image");
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my attendance (student)
const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const attendance = await Attendance.find({ student: student._id }).sort("-date");
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update single record
const updateAttendance = async (req, res) => {
  try {
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!att) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Updated", att });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
const deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { markAttendance, getAttendanceByClass, getMyAttendance, updateAttendance, deleteAttendance };