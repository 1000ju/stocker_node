"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "attendance_quiz",
      {
        quizOX_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        question_OX: { type: S.TEXT, allowNull: false },
        is_correct: { type: S.TINYINT, allowNull: false },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("attendance_quiz");
  },
};
