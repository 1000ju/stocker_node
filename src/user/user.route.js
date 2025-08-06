// 📁 src/user/user.route.js
const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// 로그인/회원가입 (보호 X)
router.post("/signup", userController.signup);
router.post("/login", userController.login); //-> 로그인 할때 검증 필요하지 않나?

// 보호된 라우터 (보호 O)
router.post("/logout", authMiddleware, userController.logout);
//router.get("/mypage", authMiddleware, userController.getMyPage);

module.exports = router;
