// "use strict";
// module.exports = {
//   async up(q) {
//     await q.bulkInsert("chapter", [
//       { title: "주식 기초 개념", keyword: "주식" },
//       { title: "재무제표 이해", keyword: "재무제표" },
//     ]);
//   },
//   async down(q) {
//     await q.bulkDelete("chapter", null, {});
//   },
// };


"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("chapter", [
      {
        id: 1,
        title: "주식 투자의 첫걸음",
        keyword: "주식,주주,증권사,계좌,예수금,HTS,MTS,매수,매도,KOSPI,KOSDAQ",
      },
      {
        id: 2,
        title: "주식 시장의 구조와 종류",
        keyword:
          "발행시장,유통시장,장내시장,장외시장,거래시간,동시호가,상한가,서킷브레이커,VI,관리종목",
      },
      {
        id: 3,
        title: "기업 분석의 기초: 재무제표 이해하기",
        keyword:
          "재무제표,재무상태표,손익계산서,현금흐름표,자산,부채,자본,매출액,영업이익,당기순이익,DART",
      },
      {
        id: 4,
        title: "기업 가치 평가: 핵심 투자 지표",
        keyword: "PER,PBR,PSR,ROE,ROA,EPS,BPS,SPS,EV/EBITDA,배당수익률,PEG",
      },
      {
      id: 5,
       title: "차트 분석의 기초: 기술적 분석 입문",
       keyword: "기술적분석,기본적분석,캔들,거래량,이동평균선,골든크로스,지지선,저항선,보조지표,추세선",
      },
      {
        id: 6,
        title: "주식 주문과 거래의 모든 것",
        keyword: "지정가,시장가,조건부주문,공매도,신용거래,대차거래,환전,프리마켓,ADR,배당락",
      },
      {
        id: 7,
        title: "나만의 투자 포트폴리오 만들기",
        keyword:
          "포트폴리오,분산투자,자산배분,리밸런싱,ETF,인덱스펀드,상관관계,위험관리,채권,원자재",
      },
      {
        id: 8,
        title: "경제를 읽는 눈: 거시 경제 지표",
        keyword:
          "금리,인플레이션,환율,GDP,실업률,경기선행지수,중앙은행,통화정책,양적완화,테이퍼링",
      },
      {
        id: 9,
        title: "다양한 투자 전략과 대가들의 철학",
        keyword:
          "가치투자,성장주투자,배당주투자,모멘텀투자,퀀트투자,워렌버핏,피터린치,벤저민그레이엄",
      },
      {
        id: 10,
        title: "투자 마인드셋과 실전 팁",
        keyword:
          "행동경제학,FOMO,손실회피,복리,자금관리,투자원칙,심리,뉴스,공시,애널리스트",
      },
    ]);
  },

  async down(q) {
    await q.bulkDelete("chapter", null, {});
  },
};
