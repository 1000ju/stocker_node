// models/AttendanceQuiz.js
module.exports = (sequelize, DataTypes) => {
  const AttendanceQuiz = sequelize.define(
    "AttendanceQuiz",
    {
      quizOX_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_OX: { type: DataTypes.STRING, allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      tableName: "attendance_quiz", // 실제 테이블명에 맞추세요 (복수형이면 'attendance_quizzes')
      timestamps: false,
    }
  );

  // 필요 시 관계 정의 추가
  // AttendanceQuiz.associate = (models) => {};

  return AttendanceQuiz;
};
