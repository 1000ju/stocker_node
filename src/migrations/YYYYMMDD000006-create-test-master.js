"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "test_master",
      {
        id: { type: S.BIGINT, autoIncrement: true, primaryKey: true },
        version: { type: S.STRING(20) },
        dimension_code: { type: S.CHAR(1) },
        dimension_name: { type: S.STRING(50) },
        left_label: { type: S.STRING(50) },
        right_label: { type: S.STRING(50) },
        left_desc: { type: S.STRING(50) },
        right_desc: { type: S.STRING(50) },
        global_no: { type: S.INTEGER },
        dm_no: { type: S.INTEGER },
        question_text: { type: S.STRING(500) },
        is_reverse: { type: S.TINYINT },
        note: { type: S.STRING(100) },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("test_master");
  },
};
