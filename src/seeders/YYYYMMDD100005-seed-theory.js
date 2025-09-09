"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("theory", [
      {
        chapter_id: 1,
        word: "주식이란?",
        content:
          "주식은 기업이 자금을 조달하기 위해 발행하는 소유권의 일부를 의미합니다.",
      },
      {
        chapter_id: 1,
        word: "주가 변동",
        content:
          "주가는 기업 가치, 수요와 공급, 경제 상황 등에 따라 변동합니다.",
      },
      {
        chapter_id: 2,
        word: "재무제표란?",
        content:
          "재무제표는 기업의 재무상태와 경영성과를 나타내는 보고서입니다.",
      },
      {
        chapter_id: 2,
        word: "손익계산서",
        content:
          "손익계산서는 일정 기간 동안의 수익과 비용을 나타내는 보고서입니다.",
      },
    ]);
  },
  async down(q) {
    await q.bulkDelete("theory", null, {});
  },
};
