const wrongNoteService = require("./wrong_note.service");

/** [GET | POST] /api/wrong_note/mypage - 오답노트 목록 조회 */
exports.getWrongNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }

    // chapterId는 선택사항 (없으면 전체 조회)
    const chapterId = req.query?.chapter_id ?? req.body?.chapter_id ?? null;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📋 [WRONG_NOTE] 조회 요청 - 사용자: ${userId}, 챕터: ${chapterId || '전체'}`);
    }

    const data = await wrongNoteService.getWrongNoteList(userId, chapterId);
    
    // Flutter 모델과 호환되는 형식으로 응답
    return res.status(200).json({
      wrong_notes: data // ✅ WrongNoteResponse.fromJson()과 호환
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ [WRONG_NOTE] 조회 오류:", err);
    }
    return res.status(err.status || 500).json({ 
      message: err.message || "오답노트 조회 실패" 
    });
  }
};

/** [POST] /api/wrong_note/submit - 퀴즈 결과 제출하여 오답노트 업데이트 */
exports.submitQuizResults = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const { chapterId, wrongItems } = req.body;
    
    if (!chapterId) {
      return res.status(400).json({ message: "chapterId는 필수입니다." });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 [WRONG_NOTE] 결과 제출 - 사용자: ${userId}, 챕터: ${chapterId}, 오답 수: ${wrongItems?.length || 0}`);
    }

    const result = await wrongNoteService.replaceForChapter(userId, chapterId, wrongItems || []);
    
    return res.status(200).json({
      success: true,
      replaced: result.replaced,
      count: result.count,
      message: `오답노트가 업데이트되었습니다. (${result.count}개 항목)`
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ [WRONG_NOTE] 제출 오류:", err);
    }
    return res.status(err.status || 500).json({ 
      message: err.message || "퀴즈 결과 제출 실패" 
    });
  }
};

/** [DELETE] /api/wrong_note/:quizId - 특정 오답 문제 삭제 */
exports.removeWrongNote = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const { quizId } = req.params;
    
    if (!quizId) {
      return res.status(400).json({ message: "quizId는 필수입니다." });
    }

    const { sequelize, WrongNote } = require("../model");
    
    const result = await WrongNote.destroy({
      where: { 
        user_id: userId, 
        quiz_id: Number(quizId) 
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: "삭제할 오답노트를 찾을 수 없습니다." });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ [WRONG_NOTE] 삭제 완료 - 사용자: ${userId}, 퀴즈: ${quizId}`);
    }

    return res.status(200).json({
      success: true,
      message: "오답노트에서 삭제되었습니다."
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ [WRONG_NOTE] 삭제 오류:", err);
    }
    return res.status(err.status || 500).json({ 
      message: err.message || "오답노트 삭제 실패" 
    });
  }
};

/** [PATCH] /api/wrong_note/:quizId/retry - 문제 재시도 표시 */
exports.markAsRetried = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const { quizId } = req.params;
    
    if (!quizId) {
      return res.status(400).json({ message: "quizId는 필수입니다." });
    }

    // 현재는 단순히 성공 응답 (실제로는 별도 테이블이나 플래그 필요)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 [WRONG_NOTE] 재시도 표시 - 사용자: ${userId}, 퀴즈: ${quizId}`);
    }

    return res.status(200).json({
      success: true,
      message: "재시도로 표시되었습니다."
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ [WRONG_NOTE] 재시도 표시 오류:", err);
    }
    return res.status(err.status || 500).json({ 
      message: err.message || "재시도 표시 실패" 
    });
  }
};
