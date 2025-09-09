"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "user",
      {
        id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: S.STRING(255), allowNull: false },
        password: { type: S.STRING(255), allowNull: false },
        nickname: { type: S.STRING(255) },
        profile_image_url: { type: S.TEXT },
        provider: { type: S.STRING(50) },
        age: { type: S.INTEGER },
        occupation: { type: S.STRING(100) },
        created_date: {
          type: S.DATEONLY,
          defaultValue: S.literal("(CURRENT_DATE)"),
        },

        access_token: { type: S.TEXT },
        refresh_token: { type: S.TEXT },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("user");
  },
};
