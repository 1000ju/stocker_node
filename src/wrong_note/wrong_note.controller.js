const wrongNoteService = require("./wrong_note.service");

/** [GET | POST] /wrong-note/mypage */
exports.getWrongNotes = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // 토큰 없으면 1로
    const chapterId = req.query?.chapter_id ?? req.body?.chapter_id;

    const data = await wrongNoteService.getWrongNoteList(userId, chapterId);
    return res.status(200).json(data);
  } catch (err) {
    console.error("오답노트 조회 오류:", err);
    return res.status(err.status || 500).json({ message: err.message || "서버 오류" });
  }
};
