const express = require("express");
const router = express.Router();
const theoryController = require("../controllers/theory.controller");
const authMiddleware = require("../middleware/authMiddleware");

// JWT 인증 먼저 통과해야 접근 가능
router.use(authMiddleware);

// [POST] /api/theory/enter - 특정 챕터의 이론 슬라이드 진입
router.post("/enter", theoryController.enterTheory);

// [PATCH] /api/theory/progress - 현재 이론 페이지 진도 갱신
router.patch("/progress", theoryController.updateProgress);

// [PATCH] /api/theory/complete - 이론 학습 완료 처리
router.patch("/complete", theoryController.completeTheory);

module.exports = router;
