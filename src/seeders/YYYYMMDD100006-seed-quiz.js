"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("quiz", [
      {
        chapter_id: 1,
        question: "주식의 정의로 올바른 것은?",
        option_1: "기업의 부채",
        option_2: "기업의 소유권 일부",
        option_3: "정부의 지원금",
        option_4: "배당금",
        correct_option: 2,
        hint: "소유권을 의미하는 단어에 주목하세요.",
      },
      {
        chapter_id: 1,
        question: "주가가 변동하는 주된 이유는?",
        option_1: "정부 보조금",
        option_2: "기업 가치와 수요/공급",
        option_3: "배당금 고정",
        option_4: "법률 규제",
        correct_option: 2,
        hint: "경제 상황과 수요 공급에 따라 달라집니다.",
      },
      {
        chapter_id: 2,
        question: "재무제표의 목적은?",
        option_1: "세금 계산만을 위함",
        option_2: "기업의 재무상태와 성과 보고",
        option_3: "광고비 집행",
        option_4: "상품 판매",
        correct_option: 2,
        hint: "재무 상태와 경영 성과 관련 키워드에 집중하세요.",
      },
      {
        chapter_id: 2,
        question: "손익계산서가 나타내는 것은?",
        option_1: "자산과 부채",
        option_2: "현금흐름",
        option_3: "수익과 비용",
        option_4: "주주명부",
        correct_option: 3,
        hint: "수익/비용 개념이 핵심입니다.",
      },
    ]);
  },
  async down(q) {
    await q.bulkDelete("quiz", null, {});
  },
};
