const express = require("express");
const router = express.Router();
const { getWrongNotes } = require("./wrong_note.controller");
const auth = require("../middleware/auth.middleware");

// 운영에선 auth 권장 (개발 중이면 잠깐 빼도 OK)
router.get("/mypage", auth, getWrongNotes);
router.post("/mypage", auth, getWrongNotes);

module.exports = router;
