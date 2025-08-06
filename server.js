// server.js

// 📦 app.js에서 정의된 Express 앱 불러오기
const app = require("./src/app");

// 🌱 .env 파일에서 환경 변수 로드 (PORT 등)
require("dotenv").config();

// 포트 번호 설정: .env에 PORT가 있으면 그걸 쓰고, 없으면 기본값 8080
const PORT = process.env.PORT || 8080;

// 🚀 서버 시작 + 예외 처리 추가
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

// ❗ 예기치 못한 에러 발생 시 서버가 바로 죽지 않도록 로그 출력 (중요)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1); // 치명적인 경우 종료
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
  // 필요 시 graceful shutdown 처리 가능
});
