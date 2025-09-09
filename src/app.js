// src/app.js
const dotenv = require("dotenv");
dotenv.config(); // ✅ .env 로드
console.log("🧶 SESSION_SECRET :", process.env.SESSION_SECRET);

const express = require("express");
const session = require("express-session");
const cors = require("cors");

// ⬇️ 라우터들 (필요 시 주석 해제/경로 조정)
const userRoutes = require("./user/user.route");
const attendance = require("./attendance/attendance.route");
const investment_profile = require("./investment_profile/investment_profile.route");
const memo = require("./memo/memo.route");
const chapterRoutes = require("./chapter/chapter.route");
const theoryRoutes = require("./theory/theory.route");
const quizRoutes = require("./quiz/quiz.route");
const wrongNoteRoutes = require("./wrong_note/wrong_note.route");

const app = express();

// ✅ 프록시 뒤(리버스 프록시/Caddy)에서 true로 설정하면 secure 쿠키 사용 가능
app.set("trust proxy", 1);

//app.use(cors());는 "실행 결과인 미들웨어"를 전달
app.use(
  cors({
    // 🐳 필요하다면 CORS 도메인을 환경변수로 제한하세요.
    // origin: process.env.CORS_ORIGIN?.split(",") || true,
    origin: true,
    credentials: true,
  })
);

// ✅ JSON 형태의 요청 body를 파싱
app.use(express.json());

// ✅ 세션 (개발: 메모리 스토어 / 운영: Redis 등 외부 스토어 권장)
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 🔐 세션 쿠키 서명용 비밀 키
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // 🐳 프록시+HTTPS에서 true 권장
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

// 🐳 컨테이너 헬스/레디니스 체크 엔드포인트
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));
app.get("/readyz", (_req, res) => res.status(200).json({ ready: true }));

// ✅ 실제 API 라우트 연결
app.use("/api/user", userRoutes);
app.use("/api/attendance", attendance);
app.use("/api/investment_profile", investment_profile);
app.use("/api/memo", memo);
app.use("/api/chapters", chapterRoutes);
app.use("/api/theory", theoryRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/wrong_note", wrongNoteRoutes);

module.exports = app;
