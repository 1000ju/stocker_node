// 📁 src/controllers/quiz.controller.js

const quizService = require("../quiz/quiz.service");

/**
 * 📌 [POST] /api/quiz/enter
 * 퀴즈 시작: 문제 목록 + 현재 위치 반환
 */
exports.enterQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapter_id } = req.body;

    if (!chapter_id) {
      return res.status(400).json({ message: "chapter_id는 필수입니다." });
    }

    const result = await quizService.getQuizList(userId, chapter_id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("퀴즈 진입 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

/**
 * 📌 [PATCH] /api/quiz/progress
 * 퀴즈 슬라이드 넘기면서 현재 위치 저장
 */
exports.updateQuizProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapter_id, current_quiz_id } = req.body;

    if (!chapter_id || !current_quiz_id) {
      return res.status(400).json({ message: "chapter_id와 current_quiz_id는 필수입니다." });
    }

    await quizService.saveQuizProgress(userId, chapter_id, current_quiz_id);
    return res.status(200).json({ message: "퀴즈 위치 저장 완료" });
  } catch (error) {
    console.error("퀴즈 진도 저장 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

/**
 * 📌 [POST] /api/quiz/complete
 * 퀴즈 완료: 채점 + 오답 저장 + 완료 처리
 */
exports.completeQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapter_id, answers } = req.body;

    if (!chapter_id || !Array.isArray(answers)) {
      return res.status(400).json({ message: "chapter_id와 answers 배열은 필수입니다." });
    }

    const result = await quizService.submitQuiz(userId, chapter_id, answers);
    return res.status(200).json(result);
  } catch (error) {
    console.error("퀴즈 완료 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};
