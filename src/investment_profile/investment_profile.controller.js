const svc = require("./investment_profile.service");
const { User } = require("../model"); // (O) 중괄호로 구조분해 할당!

// 1) 저장 (최초)
exports.saveResult = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const { created, row } = await svc.saveResult(userId, req.body);
    return res.status(created ? 201 : 200).json({
      created,
      profile_id: row.profile_id,
      user_id: row.user_id,
      type: row.type,
      matched_master: JSON.parse(row.matched_master || "[]"),
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// 2) 조회
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
      type: row.type,
      matched_master: JSON.parse(row.matched_master || "[]"),
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// 3) 재검사 갱신
exports.retestAndUpdate = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const row = await svc.retestAndUpdate(userId, req.body);
    return res.status(200).json({
      profile_id: row.profile_id,
      user_id: row.user_id,
      type: row.type,
      matched_master: JSON.parse(row.matched_master || "[]"),
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
