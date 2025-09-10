// src/app.js
const dotenv = require("dotenv");
dotenv.config(); // ✅ .env 로드
console.log("🧶 SESSION_SECRET :", process.env.SESSION_SECRET);

const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

// ✅ Swagger UI (프로젝트 루트의 openapi.yaml 읽기)
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load(path.join(__dirname, "..", "openapi.yml"));
// └ src/app.js 기준으로 상위(프로젝트 루트)/openapi.yaml

// ⬇️ 라우터들
const userRoutes = require("./user/user.route");
const attendance = require("./attendance/attendance.route");
const investment_profile = require("./investment_profile/investment_profile.route");
const memo = require("./memo/memo.route");
const chapterRoutes = require("./chapter/chapter.route");
const theoryRoutes = require("./theory/theory.route");
const quizRoutes = require("./quiz/quiz.route");
const wrongNoteRoutes = require("./wrong_note/wrong_note.route");

const app = express();

// ✅ 프록시(리버스 프록시/Caddy/Nginx 등) 뒤에서 secure 쿠키 사용 가능
app.set("trust proxy", 1);

// CORS (운영은 화이트리스트 권장: process.env.CORS_ORIGIN="https://foo.com,https://bar.com")
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
      : true,
    credentials: true,
  })
);

// ✅ JSON 형태의 요청 body 파싱
app.use(express.json());

// ✅ 세션 (개발: 메모리 스토어 / 운영: Redis 등 권장)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

/* -------------------- Swagger UI -------------------- */

// (옵션) 기본 인증으로 /api-docs 보호하고 싶을 때 .env에 DOCS_USER / DOCS_PASS 설정
const docsAuthEnabled = !!(process.env.DOCS_USER && process.env.DOCS_PASS);
if (docsAuthEnabled) {
  app.use("/api-docs", (req, res, next) => {
    const header = req.headers.authorization || "";
    const [, b64] = header.split(" ");
    const [user, pass] = Buffer.from(b64 || "", "base64")
      .toString()
      .split(":");
    if (user === process.env.DOCS_USER && pass === process.env.DOCS_PASS)
      return next();
    res.set("WWW-Authenticate", 'Basic realm="docs"').status(401).end();
  });
}
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// 루트로 들어오면 문서로 이동 (Cannot GET / 방지)
app.get("/", (_req, res) => res.redirect("/api-docs"));

/* -------------------- 헬스/레디니스 -------------------- */

// 컨테이너 헬스/레디니스 (내부용)
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));
app.get("/readyz", (_req, res) => res.status(200).json({ ready: true }));

// Swagger 스펙과 일치하는 퍼블릭 헬스체크 (/api/health)
// openapi.yaml의 paths: /health  + servers.url: .../api  => 최종 URL: .../api/health
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

/* -------------------- 실제 API 라우트 -------------------- */

app.use("/api/user", userRoutes);
app.use("/api/attendance", attendance);
app.use("/api/investment_profile", investment_profile);
app.use("/api/memo", memo);
app.use("/api/chapters", chapterRoutes);
app.use("/api/theory", theoryRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/wrong_note", wrongNoteRoutes);

module.exports = app;
