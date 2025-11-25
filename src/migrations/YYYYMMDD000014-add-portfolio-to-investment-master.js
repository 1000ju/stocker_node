"use strict";

// 투자 거장 테이블에 포트폴리오 비중(JSON)을 추가한다.
module.exports = {
  async up(q, S) {
    await q.addColumn("investment_master", "portfolio", {
      type: S.JSON,
      allowNull: true,
      comment: "예: {주식:80, 현금:20, 선물:0, 원자재:0}",
    });
  },
  async down(q) {
    await q.removeColumn("investment_master", "portfolio");
  },
};
