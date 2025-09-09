const express = require("express");
const router = express.Router();
const { 
  getWrongNotes, 
  submitQuizResults, 
  removeWrongNote, 
  markAsRetried 
} = require("./wrong_note.controller");
const auth = require("../middleware/auth.middleware");

// 모든 요청에 인증 필요
router.use(auth);

// 오답노트 조회 (GET/POST 둘 다 지원)
router.get("/mypage", getWrongNotes);
router.post("/mypage", getWrongNotes);

// 퀴즈 결과 제출하여 오답노트 업데이트
router.post("/submit", submitQuizResults);

// 특정 오답 문제 삭제
router.delete("/:quizId", removeWrongNote);

// 문제 재시도 표시
router.patch("/:quizId/retry", markAsRetried);

module.exports = router;
