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

exports.getHint = async (req, res) => {
  try {
    // 어디로 오든 한 번에 처리
    const rawId =
      req.params?.quiz_id ?? req.query?.quiz_id ?? req.body?.quiz_id;

    // 디버깅에 도움
    // console.log("quiz_id sources:", {
    //   params: req.params?.quiz_id,
    //   query: req.query?.quiz_id,
    //   body: req.body?.quiz_id,
    //   contentType: req.headers["content-type"],
    // });

    const quizId = Number(rawId);
    if (!Number.isInteger(quizId)) {
      return res.status(400).json({ message: "quiz_id는 숫자여야 합니다." });
    }

    const hint = await quizService.getHintById(quizId);
    if (!hint) {
      return res.status(404).json({ message: "해당 퀴즈를 찾을 수 없습니다." });
    }

    return res.status(200).json({ quiz_id: quizId, hint });
  } catch (e) {
    console.error("힌트 조회 오류:", e);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

// 👇 추가
exports.getHintById = async (quizId) => {
  const quiz = await Quiz.findOne({
    where: { id: quizId },
    attributes: ["hint"],
    raw: true,
  });
  return quiz ? quiz.hint : null;
};