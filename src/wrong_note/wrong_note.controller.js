// 📁 src/controllers/wrongNote.controller.js

const wrongNoteService = require("../services/wrongNote.service");

/**
 * 📌 [GET] /api/wrong-note/mypage?chapter_id=1
 * 오답노트 조회 (선택된 챕터 기준)
 */
exports.getWrongNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const chapterId = req.query.chapter_id;

    if (!chapterId) {
      return res.status(400).json({ message: "chapter_id는 필수입니다." });
    }

    const notes = await wrongNoteService.getWrongNoteList(userId, chapterId);
    return res.status(200).json(notes);
  } catch (error) {
    console.error("오답노트 조회 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};
