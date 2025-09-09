"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "wrong_note",
      {
        id: { type: S.BIGINT, autoIncrement: true, primaryKey: true },
        quiz_id: {
          type: S.INTEGER,
          references: { model: "quiz", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        chapter_id: {
          type: S.INTEGER,
          references: { model: "chapter", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        user_id: {
          type: S.INTEGER,
          references: { model: "user", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        created_date: { type: S.DATEONLY },
        selected_option: { type: S.INTEGER },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("wrong_note");
  },
};
