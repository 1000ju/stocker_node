// 같은 폴더 안에 있으니 ./ 로 연결
const wrongNoteService = require("./wrong_note.service");

/**
 * 📌 [GET] /wrong-note/mypage?chapter_id=1
 * 오답노트 조회 (선택된 챕터 기준)
 */
exports.getWrongNotes = async (req, res) => {
  try {
    // JWT 미적용 시 테스트용 값
    const userId = req.user?.id || 1;
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

