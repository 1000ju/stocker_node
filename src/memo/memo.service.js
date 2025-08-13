// services/memoService.js
const { Memo, sequelize } = require("../model");

module.exports = {
  // 1) 유저 메모 전체 조회
  async list(userId) {
    return Memo.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });
  },

  // 2) 저장·갱신
  async saveOrUpdate(userId, body) {
    const { id, template_type, content } = body;

    return sequelize.transaction(async (t) => {
      if (!id) {
        return Memo.create(
          { user_id: userId, template_type, content },
          { transaction: t }
        );
      }

      const existing = await Memo.findOne({
        where: { id, user_id: userId },
        transaction: t,
      });
      if (!existing) {
        const e = new Error("memo not found");
        e.status = 404;
        throw e;
      }

      await Memo.update(
        { template_type, content, created_at: new Date() },
        { where: { id, user_id: userId }, transaction: t }
      );

      return Memo.findOne({ where: { id, user_id: userId }, transaction: t });
    });
  },

  // 3) 삭제 (하드 삭제)
  async remove(userId, memoId) {
    return sequelize.transaction(async (t) => {
      const existing = await Memo.findOne({
        where: { id: memoId, user_id: userId },
        transaction: t,
      });
      if (!existing) {
        const e = new Error("memo not found");
        e.status = 404;
        throw e;
      }
      await Memo.destroy({
        where: { id: memoId, user_id: userId },
        transaction: t,
      });
      return { success: true };
    });
  },
};
