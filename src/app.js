console.log("app.js 시작");

// app.js
const dotenv = require("dotenv");
dotenv.config(); // ✅ .env 파일을 환경변수로 등록
console.log("SESSION_SECRET 미엄;닝러;민어ㅏ:", process.env.SESSION_SECRET);

const express = require("express");
const session = require("express-session");
const userRoutes = require("./user/user.route"); // 유저 라우터

const app = express();

// ✅ JSON 형태의 요청 body를 파싱할 수 있도록 설정
app.use(express.json());

// ✅ 세션 미들웨어 설정 (express-session)
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 🔐 세션 쿠키 서명용 비밀 키
    resave: false, // 요청 중 세션이 수정되지 않으면 저장하지 않음
    saveUninitialized: false, // 로그인 등 세션이 설정되기 전까지 저장 안 함
    cookie: {
      secure: false, // HTTPS 환경에서만 쿠키 사용 (로컬 테스트는 false)
      httpOnly: true, // JavaScript에서 접근 불가능 (보안 강화)
      maxAge: 1000 * 60 * 60, // 쿠키 유효 시간 (1시간)
    },
  })
);

// ✅ 라우터 등록
app.use("/users", userRoutes); // ex) POST /users/login

module.exports = app;
