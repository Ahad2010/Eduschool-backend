const Result  = require("../models/Result");
const Student = require("../models/Student");

// Auto calculate grade
const calcGrade = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
};

// Add/Update result (teacher/admin)
const addResult = async (req, res) => {
  try {
    const { studentId, class: cls, exam, subjects } = req.body;
    const totalMarks    = subjects.reduce((a, s) => a + s.total,    0);
    const obtainedMarks = subjects.reduce((a, s) => a + s.obtained, 0);
    const percentage    = Math.round((obtainedMarks / totalMarks) * 100);
    const grade         = calcGrade(percentage);

    const result = await Result.findOneAndUpdate(
      { student: studentId, exam, class: cls },
      { student: studentId, class: cls, exam, subjects, totalMarks, obtainedMarks, percentage, grade, teacher: req.user._id },
      { upsert: true, new: true }
    );
    res.json({ message: "Result saved", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all results (admin)
const getAllResults = async (req, res) => {
  try {
    const { class: cls, exam } = req.query;
    const filter = {};
    if (cls)  filter.class = cls;
    if (exam) filter.exam  = exam;
    const results = await Result.find(filter).populate("student","name rollNo image");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my results (student)
const getMyResults = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const results = await Result.find({ student: student._id }).sort("-createdAt");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update result
const updateResult = async (req, res) => {
  try {
    const { subjects } = req.body;
    let update = req.body;
    if (subjects) {
      const totalMarks    = subjects.reduce((a,s)=>a+s.total,    0);
      const obtainedMarks = subjects.reduce((a,s)=>a+s.obtained, 0);
      const percentage    = Math.round((obtainedMarks/totalMarks)*100);
      update = { ...update, totalMarks, obtainedMarks, percentage, grade: calcGrade(percentage) };
    }
    const result = await Result.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: "Updated", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete result
const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addResult, getAllResults, getMyResults, updateResult, deleteResult };