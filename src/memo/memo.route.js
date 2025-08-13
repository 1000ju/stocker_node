// routes/memo.route.js
const express = require("express");
const router = express.Router();
const memoController = require("../memo/memo.controller");
const authMiddleware = require("../middleware/auth.middleware");

// 토큰 유효성 검사 미들웨어 적용
router.use(authMiddleware);

// 조회(전체)
router.get("/", memoController.list);

// 저장·갱신
router.put("/", memoController.saveOrUpdate);

// 삭제
router.delete("/:id", memoController.remove);

module.exports = router;
