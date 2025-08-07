const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const authMiddleware = require("../middleware/authMiddleware");

// 모든 요청은 토큰 인증 필요
router.use(authMiddleware);

// [POST] /api/quiz/enter - 퀴즈 시작 시 호출
router.post("/enter", quizController.enterQuiz);

// [PATCH] /api/quiz/progress - 퀴즈 중간 저장 (current_quiz_id 저장)
router.patch("/progress", quizController.updateQuizProgress);

// [POST] /api/quiz/complete - 퀴즈 완료 + 오답 저장
router.post("/complete", quizController.completeQuiz);

module.exports = router;