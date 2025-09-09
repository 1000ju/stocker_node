"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "chapter",
      {
        id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: S.STRING(255) },
        keyword: { type: S.STRING(100) },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("chapter");
  },
};
