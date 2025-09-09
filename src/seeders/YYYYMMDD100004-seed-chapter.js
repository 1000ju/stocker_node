"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("chapter", [
      { title: "주식 기초 개념", keyword: "주식" },
      { title: "재무제표 이해", keyword: "재무제표" },
    ]);
  },
  async down(q) {
    await q.bulkDelete("chapter", null, {});
  },
};
