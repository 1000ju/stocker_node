"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "quiz",
      {
        id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        chapter_id: {
          type: S.INTEGER,
          references: { model: "chapter", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        question: { type: S.TEXT },
        option_1: { type: S.TEXT },
        option_2: { type: S.TEXT },
        option_3: { type: S.TEXT },
        option_4: { type: S.TEXT },
        correct_option: { type: S.INTEGER },
        hint: { type: S.TEXT },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("quiz");
  },
};
