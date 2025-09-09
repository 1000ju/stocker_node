// routes/attendance.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const attendanceController = require("../attendance/attendance.controller");

router.get("/quiz/start", auth, attendanceController.startQuiz);
router.post("/quiz/submit", auth, attendanceController.submitAttendance);
router.get("/history", auth, attendanceController.getAttendanceHistory);

module.exports = router;
