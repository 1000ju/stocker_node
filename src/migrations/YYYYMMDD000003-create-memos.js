"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable(
      "memos",
      {
        id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: {
          type: S.INTEGER,
          allowNull: false,
          references: { model: "user", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        template_type: {
          type: S.ENUM("일지", "복기", "체크리스트", "자유", "재무제표"),
          allowNull: false,
        },
        content: { type: S.JSON, allowNull: false },
        created_at: {
          type: S.DATE,
          defaultValue: S.literal("CURRENT_TIMESTAMP"),
        },
      },
      { charset: "utf8mb4", collate: "utf8mb4_general_ci", engine: "InnoDB" }
    );
  },
  async down(q) {
    await q.dropTable("memos");
  },
};
