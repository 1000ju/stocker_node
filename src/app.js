// app.js
const dotenv = require("dotenv");
dotenv.config(); // ✅ .env 파일을 환경변수로 등록
console.log("🧶 SESSION_SECRET :", process.env.SESSION_SECRET);

const express = require("express");
const session = require("express-session");
const userRoutes = require("./user/user.route"); // 유저 라우터
const attendance = require("./attendance/attendance.route"); // 출석 라우터
const investment_profile = require("./investment_profile/investment_profile.route");
const memo = require("./memo/memo.route");

const chapterRoutes = require("./chapter/chapter.route"); // 챕터 라우터
const theoryRoutes = require("./theory/theory.route"); // theory 라우터
const quizRoutes = require("./quiz/quiz.route");
const wrongNoteRoutes = require("./wrong_note/wrong_note.route");
const cors = require("cors");

const app = express();

//app.use(cors());는 "실행 결과인 미들웨어"를 전달
app.use(cors());

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


app.use("/user", userRoutes);
app.use("/attendance", attendance);
app.use("/investment_profile", investment_profile);
app.use("/memo", memo);
app.use("/chapters", chapterRoutes);
app.use("/theory", theoryRoutes);
app.use("/quiz", quizRoutes);
app.use("/wrong_note", wrongNoteRoutes); // ⬅ 추가


module.exports = app;
