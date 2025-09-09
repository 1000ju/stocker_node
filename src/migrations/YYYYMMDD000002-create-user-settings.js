"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "user_settings",
      {
        setting_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: {
          type: S.INTEGER,
          allowNull: false,
          references: { model: "user", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        nickname: { type: S.STRING(100) },
        bio: { type: S.TEXT },
        profile_image: { type: S.STRING(255) },
        user_job: { type: S.STRING(100) },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("user_settings");
  },
};
