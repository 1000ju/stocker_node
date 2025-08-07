// services/attendanceService.js
const { Attendance, AttendanceQuiz } = require("../model");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  // 1. 랜덤 3문제 반환(이미 출석했으면 빈 배열)
  async startQuiz(userId) {
    const today = new Date().toISOString().slice(0, 10);
    let attendance = await Attendance.findOne({
      where: { user_id: userId, date: today },
    });

    if (!attendance) {
      attendance = await Attendance.create({
        user_id: userId,
        date: today,
        is_present: false,
      });
    }

    if (attendance.is_present) {
      return [];
    }

    // 랜덤 3개 퀴즈
    const quizzes = await AttendanceQuiz.findAll({
      order: Sequelize.literal("RAND()"),
      limit: 3,
    });

    return quizzes.map((q) => ({
      quizOX_id: q.quizOX_id,
      question_OX: q.question_OX,
      is_correct: q.is_correct,
    }));
  },

  // 2. 출석 처리
  async submitAttendance(userId, isPresent) {
    const today = new Date().toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({
      where: { user_id: userId, date: today },
    });
    if (!attendance) throw new Error("출석정보가 존재하지 않습니다.");

    attendance.is_present = isPresent;
    await attendance.save();

    return { success: true };
  },

  // 3. 당월 출석 이력 조회
  async getMonthlyAttendanceHistory(userId) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const attendanceList = await Attendance.findAll({
      where: {
        user_id: userId,
        date: { [Op.gte]: firstDayOfMonth },
      },
      order: [["date", "ASC"]],
    });

    return attendanceList.map((a) => ({
      date: a.date,
      is_present: a.is_present,
    }));
  },
};
