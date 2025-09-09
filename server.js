// server.js

// 🌱 .env 로드 (PORT 등)
require("dotenv").config();

// 📦 Express 앱
const app = require("./src/app");

// 🐳 도커/로컬 공용: Sequelize로 DB 연결 확인 후 서버 리슨
const { Sequelize } = require("sequelize");
const dbConfig = require("./src/config/db"); // ⬅️ 방금 정리한 config 사용

// ✅ Sequelize 인스턴스 구성 (config에서 읽어옴)
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    timezone: dbConfig.timezone,
    pool: dbConfig.pool,
  }
);

const PORT = Number(process.env.PORT) || 8080;
let server;

// 🐳 DB 준비될 때까지 재시도하면서 연결 → 연결되면 서버 시작
async function initDBWithRetry(retries = 30, delayMs = 1000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connected");
      return;
    } catch (err) {
      console.log(`⏳ DB connect failed (${i}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("DB connection failed after retries");
}

(async () => {
  try {
    await initDBWithRetry(); // ⬅️ 🐳 DB가 올라올 때까지 대기 (compose healthcheck와 궁합 좋음)

    // 🐳 컨테이너 외부에서도 접근 가능하게 0.0.0.0 바인딩
    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();

// 🧹 그레이스풀 셧다운 (SIGINT/SIGTERM)
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`);
  if (server) {
    server.close(async () => {
      try {
        await sequelize.close();
        console.log("✅ DB closed");
      } catch (e) {
        console.error("DB close error:", e);
      }
      console.log("✅ Graceful shutdown complete");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => shutdown(sig)));

// ❗ 예기치 못한 에러 로그 후 종료
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});
