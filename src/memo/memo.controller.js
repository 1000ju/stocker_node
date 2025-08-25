// controllers/memoController.js
const memoService = require("../memo/memo.service");
const { User } = require("../model"); // (O) 구조분해 할당

// 1) 유저 메모 전체 조회
exports.list = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const memos = await memoService.list(userId);
    res.json({ memos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2) 저장·갱신 (id 없으면 생성, 있으면 갱신 + created_at 갱신)
exports.saveOrUpdate = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const saved = await memoService.saveOrUpdate(userId, req.body); // body: {id?, template_type, content}
    res.json({ memo: saved });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ message: err.message });
  }
};

// 3) 삭제 (하드 삭제)
exports.remove = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userId = user.id;
    const memoId = parseInt(req.params.id, 10);
    const result = await memoService.remove(userId, memoId);
    res.json(result); // { success: true }
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ message: err.message });
  }
};
