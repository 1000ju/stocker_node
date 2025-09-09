"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "chapter_progress",
      {
        id: { type: S.BIGINT, autoIncrement: true, primaryKey: true },
        user_id: {
          type: S.INTEGER,
          references: { model: "user", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        chapter_id: {
          type: S.INTEGER,
          references: { model: "chapter", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        is_theory_completed: { type: S.BOOLEAN },
        is_quiz_completed: { type: S.BOOLEAN },
        is_chapter_completed: { type: S.BOOLEAN },
        current_theory_id: { type: S.BIGINT },
        current_quiz_id: { type: S.BIGINT },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("chapter_progress");
  },
};
