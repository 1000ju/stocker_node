"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "attendance",
      {
        attendance_id: {
          type: S.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: S.INTEGER,
          references: { model: "user", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        date: { type: S.DATEONLY },
        is_present: { type: S.BOOLEAN },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("attendance");
  },
};
