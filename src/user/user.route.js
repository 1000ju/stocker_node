// 📁 src/user/user.route.js
const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// 로그인/회원가입 (보호 X)
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// 보호된 라우터 (보호 O)
router.post("/logout", authMiddleware, userController.logout);

//프로필 수정 컨트롤러 추가
router.post("/profile", authMiddleware, userController.updateMyProfile);

module.exports = router;
