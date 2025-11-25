"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("investment_master", [
      {
        name: "Warren Buffett",
        bio: "버크셔 해서웨이 회장. 가치·안전마진·장기 보유",
        portfolio_summary:
          "코카콜라, 애플 등 장기 우량주를 적정가 이하에 매수 후 장기 보유",
        image_url: "",
        style: "가치·장기·저위험(Buy & Hold)·데이터 기반",
        type_code: "CLPD",
      },
      {
        name: "Charlie Munger",
        bio: "워렌 버핏 파트너. 인문학적 사고와 장기 투자",
        portfolio_summary:
          "소수의 질 좋은 기업을 적정 가치에 매수, 복리 효과를 노림",
        image_url: "",
        style: "가치·장기·집중·복리·분석적",
        type_code: "CLPI",
      },
      {
        name: "Ray Dalio",
        bio: "브리지워터 설립자. 리스크 패리티 전략",
        portfolio_summary: "다양화된 자산군 기반 자산배분(레버리지 기반)",
        image_url: "",
        style: "장기·데이터·매크로·리스크 관리",
        type_code: "CLAD",
      },
      {
        name: "Howard Marks",
        bio: "오크트리 공동창업자. 사이클/심리 분석 전문가",
        portfolio_summary:
          "사이클 하락 국면에서 보수적 매수, 가치/리스크 대비 투자",
        image_url: "",
        style: "사이클·심리·신중·가치",
        type_code: "CLAI",
      },
      {
        name: "Benjamin Graham",
        bio: "워렌 버핏 스승. 가치투자의 아버지",
        portfolio_summary: "저PBR/PER 중심의 철저한 분석, 안전마진",
        image_url: "",
        style: "가치·저평가·철저분석·안전마진",
        type_code: "CSPD",
      },
      {
        name: "Walter Schloss",
        bio: "벤저민 그레이엄 제자. 매우 단순 규칙으로 저평가주 매수",
        portfolio_summary: "저평가 종목 다수 보유 후 장기 보유",
        image_url: "",
        style: "가치·저평가·단순 원칙·장타 보유",
        type_code: "CSPI",
      },
      {
        name: "Joel Greenblatt",
        bio: "매직 포뮬러 저자. 수익/자본 대비 고수익 기업 투자",
        portfolio_summary: "ROIC·수익성/가치 우량 기업 매수",
        image_url: "",
        style: "가치·수익성·계량화된 규칙",
        type_code: "CSAD",
      },
      {
        name: "John Neff",
        bio: "윈저펀드 매니저. 저퍼·저피비알+배당주 집중",
        portfolio_summary: "저PER+고배당 기업 위주 장기 보유",
        image_url: "",
        style: "가치·배당·저평가·장기",
        type_code: "SAII", // ← 4자리 맞춤
      },
      {
        name: "Peter Lynch",
        bio: "마젤란펀드 매니저. 생활 속 투자법",
        portfolio_summary: "생활 속 친근기업 성장주 발굴·매수",
        image_url: "",
        style: "성장·생활 속 관찰·적극적 탐구",
        type_code: "ELAI",
      },
      {
        name: "Philip Fisher",
        bio: "성장주의 아버지. 질적 분석 중시",
        portfolio_summary: "우수 경영진/제품 성장주를 철저히 조사 후 장기 보유",
        image_url: "",
        style: "성장·질적 분석·경영진 중시",
        type_code: "ELAI",
      },
      {
        name: "Terry Smith",
        bio: "펀드스미스 설립자. 20ROCE 초과 성장주 집중",
        portfolio_summary: "ROCE 우량 기업 성장주 장기 보유",
        image_url: "",
        style: "성장·고ROCE·장기 보유",
        type_code: "ELPD",
      },
      {
        name: "Ron Baron",
        bio: "바론캐피털 창립자. 장기·성장주 집중",
        portfolio_summary: "성장 기업 장기 보유 전략",
        image_url: "",
        style: "성장·장기·집중",
        type_code: "ELPI",
      },
      {
        name: "Carl Icahn",
        bio: "행동주의 헤지펀드 투자자. 주주 행동주의 전략",
        portfolio_summary: "지분 확보→경영 개선 압박→가치 상승 기대",
        image_url: "",
        style: "행동주의·지분 확보·경영 개입",
        type_code: "ESAD",
      },
      {
        name: "David Tepper",
        bio: "앱팔루사 창업자. 경기 순환주/채권 투자",
        portfolio_summary: "경기 회복 국면에서 채권/주식 적극 매수",
        image_url: "",
        style: "경기순환·채권·주식·공격적",
        type_code: "ESAI",
      },
      {
        name: "Bill Miller",
        bio: "과거 레전드 펀드매니저. 가치+성장 융합",
        portfolio_summary: "장기적 저평가 종목+기술주 결합 투자",
        image_url: "",
        style: "가치+성장·융합형",
        type_code: "ESPD",
      },
      {
        name: "George Soros",
        bio: "퀀텀펀드 설립. 탑다운형 거시/투기적 투자자",
        portfolio_summary: "대규모 단기 매매 전략·통화/비정상적 차익거래 활용",
        image_url: "",
        style: "탑다운·거시·투기적",
        type_code: "ESPI",
      },
    ]);
  },
  async down(q) {
    await q.bulkDelete("investment_master", null, {});
  },
};
