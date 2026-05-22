const express = require("express");
const router  = express.Router();
const { protect, teacherOnly } = require("../middleware/auth");
const {
  addResult, getAllResults, getMyResults, updateResult, deleteResult,
} = require("../controllers/resultController");

router.post  ("/",     protect, teacherOnly, addResult);
router.get   ("/",     protect, teacherOnly, getAllResults);
router.get   ("/me",   protect, getMyResults);
router.put   ("/:id",  protect, teacherOnly, updateResult);
router.delete("/:id",  protect, teacherOnly, deleteResult);

module.exports = router;