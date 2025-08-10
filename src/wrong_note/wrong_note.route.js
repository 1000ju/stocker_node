const express = require("express");
const router = express.Router();

// 같은 폴더 안에 있으니 ./ 로 연결
const wrongNoteController = require("./wrong_note.controller");

// JWT 미적용 테스트 중이면 인증 주석 처리
// const authMiddleware = require("../middleware/auth.middleware");
// router.use(authMiddleware);

// [GET] /wrong-note/mypage?chapter_id=1
router.get("/", wrongNoteController.getWrongNotes);

module.exports = router;
