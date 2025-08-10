const express = require("express");
const router = express.Router();

// 챕터 컨트롤러 불러오기
const chapterController = require("../chapter/chapter.controller");

// 인증 미들웨어 불러오기 (JWT 토큰 확인용)
const authMiddleware = require("../middleware/auth.middleware");

// 모든 요청 전에 인증 미들웨어 적용
router.use(authMiddleware);

// [GET] /api/chapters - 챕터 목록 조회 요청 처리
router.get("/", chapterController.getChapters);

// 라우터 객체 외부로 내보내기 (app.js에서 사용)
module.exports = router;