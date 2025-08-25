const svc = require("./investment_profile.service");
const { User } = require("../model");

// 0) 검사지 제공 (GET /test?version=v1.1)
exports.getQuestionnaire = async (req, res) => {
  try {
    const version = req.query.version || "v1.1";
    const questions = await svc.getQuestionnaire({ version });
    return res.status(200).json({ version, questions });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// 1) 최초 저장: 응답 받아 계산 → 저장
// Body: { version: 'v1.1', answers: [{globalNo, answer}] | [{questionId, answer}] }
exports.saveResult = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;

    const { created, row, computed } = await svc.saveResultFromAnswers(
      userId,
      req.body
    );
    return res.status(created ? 201 : 200).json({
      created,
      profile_id: row.profile_id,
      user_id: row.user_id,
      type_code: row.type_code,
      matched_master: JSON.parse(row.matched_master || "[]"),
      computed, // 원하면 프론트에서 차원별 avg/confidence 활용
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// 2) 결과 조회
exports.getResult = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;

    const row = await svc.getResult(userId);
    if (!row)
      return res.status(200).json({ profile: null, matched_master: [] });

    return res.status(200).json({
      profile_id: row.profile_id,
      user_id: row.user_id,
      type_code: row.type_code,
      matched_master: JSON.parse(row.matched_master || "[]"),
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// 3) 재검사 갱신: 응답 받아 계산 → 업서트
exports.retestAndUpdate = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;

    const { row, computed } = await svc.retestAndUpdateFromAnswers(
      userId,
      req.body
    );
    return res.status(200).json({
      profile_id: row.profile_id,
      user_id: row.user_id,
      type_code: row.type_code,
      matched_master: JSON.parse(row.matched_master || "[]"),
      computed,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// 4) 모든 거장
exports.listAllMasters = async (_req, res) => {
  const list = await svc.listAllMasters();
  return res.status(200).json(list);
};
