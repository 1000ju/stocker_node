// controllers/attendanceController.js
const attendanceService = require("../attendance/attendance.service");
const { User } = require("../model"); // (O) 중괄호로 구조분해 할당!
// 퀴즈 시작
exports.startQuiz = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const quizzes = await attendanceService.startQuiz(userId);
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 출석 제출
exports.submitAttendance = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const { isPresent } = req.body;
    const result = await attendanceService.submitAttendance(userId, isPresent);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 당월 출석 이력 조회
exports.getAttendanceHistory = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const history = await attendanceService.getMonthlyAttendanceHistory(userId);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
