"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "theory",
      {
        id: { type: S.BIGINT, autoIncrement: true, primaryKey: true },
        chapter_id: {
          type: S.INTEGER,
          references: { model: "chapter", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        word: { type: S.STRING(255) },
        content: { type: S.TEXT },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("theory");
  },
};
