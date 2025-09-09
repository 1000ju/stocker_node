"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "investment_profile",
      {
        profile_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: {
          type: S.INTEGER,
          allowNull: false,
          references: { model: "user", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        type_code: { type: S.STRING(100) },
        matched_master: { type: S.TEXT },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("investment_profile");
  },
};
