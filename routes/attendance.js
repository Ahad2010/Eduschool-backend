const express = require("express");
const router  = express.Router();
const { protect, teacherOnly } = require("../middleware/auth");
const {
  markAttendance, getAttendanceByClass, getMyAttendance, updateAttendance, deleteAttendance,
} = require("../controllers/attendanceController");

router.post  ("/mark",    protect, teacherOnly, markAttendance);
router.get   ("/",        protect, teacherOnly, getAttendanceByClass);
router.get   ("/me",      protect, getMyAttendance);
router.put   ("/:id",     protect, teacherOnly, updateAttendance);
router.delete("/:id",     protect, teacherOnly, deleteAttendance);

module.exports = router;