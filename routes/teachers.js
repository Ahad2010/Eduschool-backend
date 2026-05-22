const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getAllTeachers, getMyProfile, updateMyProfile, updateTeacher, deleteTeacher,
} = require("../controllers/teacherController");

router.get   ("/",     protect, adminOnly, getAllTeachers);
router.get   ("/me",   protect, getMyProfile);
router.put   ("/me",   protect, upload.single("image"), updateMyProfile);
router.put   ("/:id",  protect, adminOnly, updateTeacher);
router.delete("/:id",  protect, adminOnly, deleteTeacher);

module.exports = router;