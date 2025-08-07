const express = require("express");
const router = express.Router();
const wrongNoteController = require("../controllers/wrongNote.controller");
const authMiddleware = require("../middleware/authMiddleware");

// 모든 요청은 인증 필요
router.use(authMiddleware);

// [GET] /api/wrong-note/mypage?chapter_id=1
router.get("/mypage", wrongNoteController.getWrongNotes);

module.exports = router;
