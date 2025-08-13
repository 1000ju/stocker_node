const quizService = require("../quiz/quiz.service");

/**
 * 📌 [POST] /api/quiz/enter
 */
exports.enterQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const chapterId = Number(req.body.chapter_id);

    if (!chapterId) return res.status(400).json({ message: "chapter_id는 필수입니다." });

    const result = await quizService.getQuizList(userId, chapterId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("퀴즈 진입 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

/**
 * 📌 [PATCH] /api/quiz/progress
 */
exports.updateQuizProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const chapterId = Number(req.body.chapter_id);
    const currentQuizId = Number(req.body.current_quiz_id);

    if (!chapterId || !currentQuizId)
      return res.status(400).json({ message: "chapter_id와 current_quiz_id는 필수입니다." });

    await quizService.saveQuizProgress(userId, chapterId, currentQuizId);
    return res.status(200).json({ message: "퀴즈 위치 저장 완료" });
  } catch (error) {
    console.error("퀴즈 진도 저장 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

/**
 * 📌 [POST] /api/quiz/complete
 * 채점 + 오답 교체 저장(selected_option 포함) + 완료 처리
 */
exports.completeQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const chapterId = Number(req.body.chapter_id);

    if (!chapterId || !Array.isArray(req.body.answers))
      return res.status(400).json({ message: "chapter_id와 answers 배열은 필수입니다." });

    // 안전한 타입 정규화 (서비스에서도 한 번 더 정규화하지만 여기서도 보강)
    const answers = req.body.answers.map(a => ({
      quiz_id: Number(a.quiz_id),
      selected_option:
        (a.selected_option === null || a.selected_option === undefined)
          ? null
          : Number(a.selected_option),
    }));

    const result = await quizService.submitQuiz(userId, chapterId, answers);
    return res.status(200).json(result);
  } catch (error) {
    console.error("퀴즈 완료 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};
