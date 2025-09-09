"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "investment_master",
      {
        master_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: S.STRING(100) },
        bio: { type: S.TEXT },
        portfolio_summary: { type: S.TEXT },
        image_url: { type: S.STRING(255) },
        style: { type: S.STRING(255) },
        type_code: { type: S.STRING(100) },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("investment_master");
  },
};
