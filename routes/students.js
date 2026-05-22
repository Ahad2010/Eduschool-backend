const express = require("express");
const router  = express.Router();
const { protect, adminOnly, teacherOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getAllStudents, getStudentsByClass, getStudent,
  getMyProfile, updateMyProfile, updateStudent, deleteStudent,
} = require("../controllers/studentController");

router.get  ("/",              protect, teacherOnly, getAllStudents);
router.get  ("/me",            protect, getMyProfile);
router.put  ("/me",            protect, upload.single("image"), updateMyProfile);
router.get  ("/class/:class",  protect, teacherOnly, getStudentsByClass);
router.get  ("/:id",           protect, teacherOnly, getStudent);
router.put  ("/:id",           protect, adminOnly,   updateStudent);
router.delete("/:id",          protect, adminOnly,   deleteStudent);

module.exports = router;