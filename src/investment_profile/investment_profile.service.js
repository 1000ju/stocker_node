// src/profile/investment.service.js
// 기능 (최신 사양 반영):
// 1) saveResult        : 최초 저장(유저 type, 추천 **상위5** 캐시: 정확 1 + 3/4 4)
// 2) getResult         : 조회(없으면 null, 캐시 누락시 즉시 **상위5**로 보강)
// 3) retestAndUpdate   : 재검사 후 갱신(업서트, 추천 **상위5** 재계산)
// 4) listAllMasters    : 모든 거장 DB에서 조회
//
// 주의:
// - 추천 로직은 "정확 일치(4/4) 1개 + 3/4 일치 4개" = 최대 5개를 반환
// - DB 스키마: investment_profile(user_id, type, matched_master TEXT/JSON), investment_master(..., type_code CHAR(4))
// - JWT에서 email 추출 → user.id 확보는 컨트롤러/미들웨어에서 수행하고, 서비스는 userId만 받는다.
const { InvestmentProfile, InvestmentMaster } = require("../model");

// --- 유틸 ---
function normalizeType(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase();
}
function validateType(t) {
  return /^[EC][SL][AP][ID]$/.test(t);
}
function scoreMBIT(a, b) {
  let s = 0;
  for (let i = 0; i < 4; i++) if (a[i] === b[i]) s++;
  return s; // 0~4
}

/**
 * DB에서 "정확 1 + 3/4 4" = 최대 5개 추출해 반환
 * userTypeCode: "ELAD" 같은 4글자
 */
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
    const code = m.type_code || "";
    const ok = validateType(code);
    return {
      master_id: m.master_id,
      name: m.name,
      bio: m.bio,
      portfolio_summary: m.portfolio_summary,
      image_url: m.image_url,
      style: m.style,
      type_code: code,
      score: ok ? scoreMBIT(userTypeCode, code) : 0,
    };
  });

  const candidates = scored
    .filter((m) => m.score >= 3)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score; // 4점(정확) 우선, 다음 3점
      return (a.name || "").localeCompare(b.name || "");
    });

  const picked = [];
  const seenType = new Set();
  for (const c of candidates) {
    if (!validateType(c.type_code)) continue;
    if (seenType.has(c.type_code)) continue; // 같은 타입 중복 제거
    picked.push(c);
    seenType.add(c.type_code);
    if (picked.length === 5) break;
  }
  return picked;
}

/**
 * 1) 최초 저장
 * - userId당 레코드가 없을 때만 생성
 * - matched_master: 상위5명(JSON)
 * 요청 바디: { "type_code": "ELAD" }
 */
async function saveResult(userId, payload) {
  const type_code = normalizeType(payload?.type_code);
  if (!type_code) throw new Error("type_code is required");
  if (!validateType(type_code)) throw new Error("invalid type_code format");

  const exists = await InvestmentProfile.findOne({
    where: { user_id: userId },
  });
  if (exists) return { created: false, row: exists };

  const top5 = await recommendTop5FromDB(type_code);
  const row = await InvestmentProfile.create({
    user_id: userId,
    type_code, // ← investment_profile 컬럼명
    matched_master: JSON.stringify(top5),
  });
  return { created: true, row };
}

/**
 * 2) 조회
 * - 캐시 누락/손상시 즉시 보강(상위5 재계산 저장)
 */
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

/**
 * 3) 재검사 갱신
 * - 없으면 생성, 있으면 새 type_code와 상위5로 덮어쓰기
 */
async function retestAndUpdate(userId, payload) {
  const type_code = normalizeType(payload?.type_code);
  if (!type_code) throw new Error("type_code is required");
  if (!validateType(type_code)) throw new Error("invalid type_code format");

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
  return row;
}

/**
 * 4) 모든 거장 조회
 */
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

module.exports = { saveResult, getResult, retestAndUpdate, listAllMasters };
