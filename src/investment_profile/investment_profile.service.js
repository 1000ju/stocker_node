// 최신 사양: 검사지 제공 + 응답 계산 + 저장까지 백엔드 담당
const {
  InvestmentProfile,
  InvestmentMaster,
  AssessmentMaster,
} = require("../model");

// ------------ 유틸 ------------
const DIM_ORDER = ["A", "B", "C", "D"]; // A→B→C→D 고정

const normalizeType = (raw) =>
  String(raw || "")
    .trim()
    .toUpperCase();
const validateType = (t) => /^[EC][SL][AP][ID]$/.test(t);
const scoreMBTI = (a, b) => {
  let s = 0;
  for (let i = 0; i < 4; i++) if (a[i] === b[i]) s++;
  return s; // 0~4
};

// 추천: "정확 1 + 3/4 일치 4" 최대 5개
async function recommendTop5FromDB(userTypeCode) {
  const masters = await InvestmentMaster.findAll({
    attributes: [
      "master_id",
      "name",
      "bio",
      "portfolio_summary",
      "image_url",
      "style",
      "type_code",
    ],
  });

  const scored = masters.map((m) => {
    const code = normalizeType(m.type_code);
    return {
      master_id: m.master_id,
      name: m.name,
      bio: m.bio,
      portfolio_summary: m.portfolio_summary,
      image_url: m.image_url,
      style: m.style,
      type_code: code,
      score: validateType(code) ? scoreMBTI(userTypeCode, code) : 0,
    };
  });

  const candidates = scored
    .filter((m) => m.score >= 3)
    .sort(
      (a, b) => b.score - a.score || (a.name || "").localeCompare(b.name || "")
    );

  const picked = [];
  const seenType = new Set();
  for (const c of candidates) {
    if (!validateType(c.type_code)) continue;
    if (seenType.has(c.type_code)) continue;
    picked.push(c);
    seenType.add(c.type_code);
    if (picked.length === 5) break;
  }
  return picked;
}

// ------------ 핵심 로직 ------------

// 1) 검사지 반환 (프론트가 요청 시 내려줌)
async function getQuestionnaire({ version = "v1.1" } = {}) {
  const rows = await AssessmentMaster.findAll({
    where: { version },
    order: [["global_no", "ASC"]],
  });

  // 응답에 필요한 최소 필드만 정리
  return rows.map((r) => ({
    questionId: r.id,
    version: r.version,
    globalNo: r.global_no,
    dimCode: r.dimension_code,
    dimName: r.dimension_name,
    leftLabel: r.left_label,
    rightLabel: r.right_label,
    question: r.question_text,
    isReverse: !!r.is_reverse,
    note: r.note || null,
  }));
}

// 2) 응답 → 타입 계산
// payload.answers: [{globalNo, answer}] 또는 [{questionId, answer}]
// 규칙: 역문은 (6 - answer), 각 차원 평균>=3.0 이면 왼쪽(E/S/A/I), 아니면 오른쪽(C/L/P/D)
async function computeTypeFromAnswers(payload) {
  const version = payload?.version || "v1.1";
  const answers = Array.isArray(payload?.answers) ? payload.answers : [];
  if (answers.length === 0) throw new Error("answers is required");

  // 마스터 로딩
  const masters = await AssessmentMaster.findAll({
    where: { version },
    order: [["global_no", "ASC"]],
  });
  if (masters.length === 0)
    throw new Error(`no questionnaire for version ${version}`);

  // 매핑: globalNo->row, id->row 모두 지원
  const byGlobalNo = new Map();
  const byId = new Map();
  masters.forEach((m) => {
    byGlobalNo.set(m.global_no, m);
    byId.set(m.id, m);
  });

  // 점수 집계
  const dimScores = {
    A: [],
    B: [],
    C: [],
    D: [],
  };
  const detail = []; // 문항별 원점수/조정점수

  for (const item of answers) {
    const ans = Number(item.answer);
    if (!(ans >= 1 && ans <= 5)) continue;

    const m =
      (item.globalNo && byGlobalNo.get(Number(item.globalNo))) ||
      (item.questionId && byId.get(Number(item.questionId)));

    if (!m) continue;

    const adjusted = m.is_reverse ? 6 - ans : ans;
    if (!dimScores[m.dimension_code]) dimScores[m.dimension_code] = [];
    dimScores[m.dimension_code].push(adjusted);

    detail.push({
      globalNo: m.global_no,
      dimCode: m.dimension_code,
      isReverse: !!m.is_reverse,
      raw: ans,
      adjusted,
    });
  }

  // 각 차원 평균 계산(문항 3개 기준)
  const dimDecision = {};
  for (const dim of DIM_ORDER) {
    const arr = dimScores[dim] || [];
    const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    // 해당 차원의 좌/우 라벨 가져오기(해당 버전에서 동일)
    const sample = masters.find((m) => m.dimension_code === dim);
    const left = sample?.left_label || "";
    const right = sample?.right_label || "";

    const label = avg >= 3.0 ? left : right;
    const confidence = Math.abs(avg - 3.0); // 0~2
    dimDecision[dim] = { avg, label, confidence, left, right };
  }

  // type_code 조합 (A→B→C→D)
  const type_code = DIM_ORDER.map((d) => dimDecision[d].label).join("");
  return {
    version,
    type_code,
    dimensions: dimDecision,
    detail, // 필요 시 프론트 디버깅/리뷰용
  };
}

// 3) 최초 저장 (프론트는 "응답"만 보내고, 백이 계산/저장)
async function saveResultFromAnswers(userId, payload) {
  const computed = await computeTypeFromAnswers(payload);
  const type_code = normalizeType(computed.type_code);
  if (!validateType(type_code)) throw new Error("computed type_code invalid");

  const exists = await InvestmentProfile.findOne({
    where: { user_id: userId },
  });
  if (exists) {
    // 이미 있으면 그대로 리턴(최초 저장 전용)
    return { created: false, row: exists, computed };
  }

  const top5 = await recommendTop5FromDB(type_code);
  const row = await InvestmentProfile.create({
    user_id: userId,
    type_code,
    matched_master: JSON.stringify(top5),
  });
  return { created: true, row, computed };
}

// 4) 조회 (없으면 null, 캐시 보강)
async function getResult(userId) {
  const row = await InvestmentProfile.findOne({ where: { user_id: userId } });
  if (!row) return null;

  if (!validateType(row.type_code) || !row.matched_master) {
    const safeCode = validateType(row.type_code) ? row.type_code : "CLPD";
    const top5 = await recommendTop5FromDB(safeCode);
    row.type_code = safeCode;
    row.matched_master = JSON.stringify(top5);
    await row.save();
  }
  return row;
}

// 5) 재검사 갱신 (응답 받아 다시 계산/업서트)
async function retestAndUpdateFromAnswers(userId, payload) {
  const computed = await computeTypeFromAnswers(payload);
  const type_code = normalizeType(computed.type_code);
  if (!validateType(type_code)) throw new Error("computed type_code invalid");

  const top5 = await recommendTop5FromDB(type_code);
  const matched_master = JSON.stringify(top5);

  const [row, created] = await InvestmentProfile.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId, type_code, matched_master },
  });

  if (
    !created &&
    (row.type_code !== type_code || row.matched_master !== matched_master)
  ) {
    row.type_code = type_code;
    row.matched_master = matched_master;
    await row.save();
  }
  return { row, computed };
}

// 6) 모든 거장 조회
async function listAllMasters() {
  return InvestmentMaster.findAll({
    attributes: [
      "master_id",
      "name",
      "bio",
      "portfolio_summary",
      "image_url",
      "style",
      "type_code",
    ],
  });
}

module.exports = {
  getQuestionnaire,
  computeTypeFromAnswers,
  saveResultFromAnswers,
  getResult,
  retestAndUpdateFromAnswers,
  listAllMasters,
};
