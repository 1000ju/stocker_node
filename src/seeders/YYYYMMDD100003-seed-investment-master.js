"use strict";

module.exports = {
  async up(q) {
    // portfolio: 자산 비중(%) JSON.
    // DB에 JSON 문자열로 저장하기 위해 JSON.stringify()를 사용합니다.
    await q.bulkInsert("investment_master", [
      {
        master_id: 1,
        name: "워렌 버핏",
        bio: "버크셔 해서웨이 회장, '오마하의 현인'",
        portfolio_summary:
          "소수의 우량 기업 주식을 장기 보유하며 복리 효과를 극대화합니다. 시장 변동성에 대비해 높은 현금 비중을 유지하는 것으로 유명합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Warren_Buffett_with_Fisher_College_of_Business_Student_-_4395157720_%28cropped%29.jpg/640px-Warren_Buffett_with_Fisher_College_of_Business_Student_-_4395157720_%28cropped%29.jpg",
        style: "가치 투자",
        type_code: "CLPD",
        portfolio: JSON.stringify({ 선물: 0, 주식: 80, 원자재: 0, 현금: 20 }),
      },
      {
        master_id: 2,
        name: "피터 린치",
        bio: "전설적인 마젤란 펀드 매니저, '월가의 영웅'",
        portfolio_summary:
          "일상생활에서 성장 가능성이 보이는 '10루타(Ten-bagger)' 종목을 발굴하는 생활 밀착형 투자를 선호합니다. 수백 개 이상의 종목에 분산 투자하는 것으로도 유명합니다.",
        image_url:
          "https://i.namu.wiki/i/7uOtqQoKoD3TPG5cWCOvCSbSd5r6HhZkTVo2B6Cd_A5JS8YQivTjcnMUW2CaC0cv1Thot3EcaKo55ydQabCftiSEEfkFCnpp-B6gp97HJunyQExHAt7QZCA4LwHsWMtPRMdvB5Ggpva3y0fjZwoQOw.webp",
        style: "성장주 투자",
        type_code: "ELAD",
        portfolio: JSON.stringify({ 선물: 5, 주식: 85, 원자재: 0, 현금: 10 }),
      },
      {
        master_id: 3,
        name: "레이 달리오",
        bio: "세계 최대 헤지펀드 브리지워터 창립자",
        portfolio_summary:
          "어떤 경제 상황에서도 안정적인 성과를 내는 '올웨더(All-Weather)' 포트폴리오를 개발했습니다. 주식, 채권, 원자재 등에 분산 투자하여 리스크를 최소화합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Web_Summit_2018_-_Forum_-_Day_2%2C_November_7_HM1_7481_%2844858045925%29.jpg/640px-Web_Summit_2018_-_Forum_-_Day_2%2C_November_7_HM1_7481_%2844858045925%29.jpg",
        style: "자산 배분",
        type_code: "CLAD",
        portfolio: JSON.stringify({ 선물: 55, 주식: 30, 원자재: 15, 현금: 0 }),
      },
      {
        master_id: 4,
        name: "존 보글",
        bio: "뱅가드 그룹 창립자, '인덱스 펀드의 아버지'",
        portfolio_summary:
          "'건초더미에서 바늘을 찾으려 하지 말고, 건초더미 전체를 사라'는 철학으로 시장 지수를 추종하는 저비용 인덱스 펀드 투자를 강조합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Photo_of_a_John_C._Bogle_By_Bill_Cramer.jpg/640px-Photo_of_a_John_C._Bogle_By_Bill_Cramer.jpg",
        style: "패시브 투자",
        type_code: "CLPI",
        portfolio: JSON.stringify({ 선물: 40, 주식: 60, 원자재: 0, 현금: 0 }),
      },
      {
        master_id: 5,
        name: "벤저민 그레이엄",
        bio: "가치 투자의 창시자이자 워렌 버핏의 스승",
        portfolio_summary:
          "기업의 내재 가치보다 현저히 낮은 가격에 거래되는 '안전 마진'을 확보한 주식에 투자할 것을 강조했습니다. 주식과 채권 비중을 50:50으로 유지하는 것을 이상적으로 보았습니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Benjamin_Graham_%281894-1976%29_in_1950.jpg/640px-Benjamin_Graham_%281894-1976%29_in_1950.jpg",
        style: "가치 투자",
        type_code: "CLPD",
        portfolio: JSON.stringify({ 선물: 50, 주식: 50, 원자재: 0, 현금: 0 }),
      },
      {
        master_id: 6,
        name: "칼 아이칸",
        bio: "월가의 '기업 사냥꾼', 행동주의 투자자",
        portfolio_summary:
          "저평가된 기업의 지분을 대량 매입한 뒤, 적극적으로 경영에 개입하여 기업 가치를 끌어올리고 수익을 창출합니다. 포트폴리오가 소수 주식에 집중되는 경향이 있습니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Carl_Icahn%2C_1980s.jpg/640px-Carl_Icahn%2C_1980s.jpg",
        style: "행동주의 투자",
        type_code: "ESAI",
        portfolio: JSON.stringify({ 선물: 10, 주식: 85, 원자재: 0, 현금: 5 }),
      },
      {
        master_id: 7,
        name: "데이비드 테퍼",
        bio: "아팔루사 매니지먼트 창립자, 부실자산 투자 전문가",
        portfolio_summary:
          "금융 위기 등 시장이 가장 비관적일 때, 부실 채권이나 저평가 주식을 대담하게 매입하여 높은 수익을 올리는 역발상 투자로 유명합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/David_Tepper_01.jpg/640px-David_Tepper_01.jpg",
        style: "역발상/부실자산 투자",
        type_code: "ESAD",
        portfolio: JSON.stringify({ 선물: 20, 주식: 65, 원자재: 5, 현금: 10 }),
      },
      {
        master_id: 8,
        name: "조지 소로스",
        bio: "퀀텀 펀드를 이끈 전설적인 매니저, '영란은행을 무너뜨린 사나이'",
        portfolio_summary:
          "거시 경제의 흐름을 읽고 통화, 금리 등에 과감하게 베팅하는 '글로벌 매크로' 전략을 사용합니다. 재귀성 이론을 바탕으로 시장의 심리를 역이용합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/George_Soros%2C_2002.jpg/640px-George_Soros%2C_2002.jpg",
        style: "글로벌 매크로",
        type_code: "ELAD",
        portfolio: JSON.stringify({ 선물: 40, 주식: 30, 원자재: 15, 현금: 15 }),
      },
      {
        master_id: 9,
        name: "빌 애크먼",
        bio: "퍼싱 스퀘어 캐피털 CEO, 집중 투자 전문가",
        portfolio_summary:
          "소수의 잘 이해하고 있는 우량 기업에 자본을 집중하여 장기 보유하는 전략을 구사합니다. 때로는 대담한 공매도 베팅으로도 잘 알려져 있습니다.",
        image_url:
          "https://i.namu.wiki/i/6ynj1QjTx2wDeEr5swwevqw6pVsvHjLH1qLkSo2e2u2wvNkYXQtyjOXbjnLBiVxLwsFeYbmtJLr3St1lcfbrpwAh_8Grgdi0A2yZBZXzrA_klnul2Ce7H7AAUpFSOgq4AXGWre87fUiL8WiUgIIE2Q.webp",
        style: "집중 투자",
        type_code: "ELPD",
        portfolio: JSON.stringify({ 선물: 5, 주식: 85, 원자재: 0, 현금: 10 }),
      },
      {
        master_id: 10,
        name: "짐 로저스",
        bio: "조지 소로스와 퀀텀 펀드를 공동 설립한 전설적 투자자",
        portfolio_summary:
          "수요와 공급의 원칙에 따라 원자재 시장의 장기적인 상승에 베팅하는 것으로 매우 유명합니다. '가치 있는 것은 싸게 사라'는 철학을 가지고 있습니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jim-rogers-madrid-160610.jpg/640px-Jim-rogers-madrid-160610.jpg",
        style: "원자재 투자",
        type_code: "CLAI",
        portfolio: JSON.stringify({ 선물: 20, 주식: 30, 원자재: 40, 현금: 10 }),
      },
      {
        master_id: 11,
        name: "일론 머스크",
        bio: "테슬라, 스페이스X CEO, 혁신의 아이콘",
        portfolio_summary:
          "전통적인 포트폴리오 투자자가 아니며, 자산 대부분이 자신이 창업한 기업의 주식(테슬라, 스페이스X 등)으로 구성되어 있습니다. 미래 기술에 대한 담대한 비전을 보고 투자합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/640px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
        style: "혁신 기술 투자",
        type_code: "ELAI",
        portfolio: JSON.stringify({ 선물: 0, 주식: 95, 원자재: 0, 현금: 5 }),
      },
      {
        master_id: 12,
        name: "마크 큐반",
        bio: "억만장자 기업가이자 NBA 댈러스 매버릭스 구단주",
        portfolio_summary:
          "성공한 사업가로서, 포트폴리오의 상당 부분을 잠재력 있는 스타트업 및 기술 기업에 투자합니다. 또한 시장 변동성에 대비해 높은 비중의 현금을 보유하는 것을 선호합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mark_Cuban_%282024%29_%28cropped%29.jpg/640px-Mark_Cuban_%282024%29_%28cropped%29.jpg",
        style: "기술/벤처 투자",
        type_code: "ESPI",
        portfolio: JSON.stringify({ 선물: 0, 주식: 60, 원자재: 0, 현금: 40 }),
      },
      {
        master_id: 13,
        name: "존 폴슨",
        bio: "2008년 금융위기 공매도로 막대한 부를 쌓은 헤지펀드 매니저",
        portfolio_summary:
          "인수합병, 파산, 구조조정 등 특정 기업 이벤트 발생 시 나타나는 가격 불일치를 이용해 수익을 내는 '이벤트 드리븐' 전략의 대가입니다.",
        image_url:
          "https://i.namu.wiki/i/wTMfoEe4bIIS4udhPhNHjjk7ka3IGM3FWoG4XhvjOZ05SJVjrmEcPv1nsqEAwzCSh8A7Dtb0uLPdCZMcyhWWiQj3YkxlOKqVJbfEejrF3JjNpmjHV-nFoIXsg9hR3355jpFTmRIqSy3dck4ws5DSyA.webp",
        style: "이벤트 드리븐",
        type_code: "ESPD",
        portfolio: JSON.stringify({ 선물: 30, 주식: 50, 원자재: 10, 현금: 10 }),
      },
      {
        master_id: 14,
        name: "찰리 멍거",
        bio: "워렌 버핏의 평생 파트너이자 버크셔 해서웨이 부회장",
        portfolio_summary:
          "버핏과 함께 가치 투자의 핵심 원칙을 공유합니다. 극도로 인내심을 갖고 소수의 위대한 기업에 집중 투자하는 것을 강조했습니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Charlie_Munger_%28cropped%29.jpg/640px-Charlie_Munger_%28cropped%29.jpg",
        style: "가치 투자",
        type_code: "CLPD",
        portfolio: JSON.stringify({ 선물: 0, 주식: 85, 원자재: 0, 현금: 15 }),
      },
      {
        master_id: 15,
        name: "하워드 막스",
        bio: "오크트리 캐피털 창립자, '투자의 구루'",
        portfolio_summary:
          "부실 채권(Distressed Debt) 투자의 대가입니다. 시장의 심리를 꿰뚫고, 남들이 공포에 빠졌을 때 과감하게 투자하는 2차적 사고를 강조합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Howard_Marks_2.17.12_%28cropped%29.jpg/640px-Howard_Marks_2.17.12_%28cropped%29.jpg",
        style: "부실 채권 투자",
        type_code: "CLAD",
        portfolio: JSON.stringify({ 선물: 70, 주식: 15, 원자재: 0, 현금: 15 }),
      },
      {
        master_id: 16,
        name: "캐시 우드",
        bio: "ARK 인베스트 CEO, '파괴적 혁신' 전도사",
        portfolio_summary:
          "인공지능, 블록체인, 유전자 기술 등 미래를 바꿀 파괴적 혁신 기술을 보유한 기업에 집중적으로 투자합니다. 높은 변동성을 감수하고 장기적인 고수익을 추구합니다.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cathie_Wood_ARK_Invest_Photo.jpg/640px-Cathie_Wood_ARK_Invest_Photo.jpg",
        style: "혁신 성장주",
        type_code: "ELPI",
        portfolio: JSON.stringify({ 선물: 0, 주식: 95, 원자재: 0, 현금: 5 }),
      },
    ]);
  },
  async down(q) {
    await q.bulkDelete("investment_master", null, {});
  },
};