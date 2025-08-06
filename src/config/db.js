// config/db.js
const mysql = require("mysql2/promise"); // 비동기/await 가능한 MySQL 클라이언트
require("dotenv").config(); // .env에서 DB 정보 불러오기

// ✅ 커넥션 풀 생성 (최대 10개까지 동시에 유지)
const pool = mysql.createPool({
  host: process.env.DB_HOST, // ex: localhost, or RDS endpoint
  user: process.env.DB_USER, // ex: root
  password: process.env.DB_PASS, // ex: 1234
  database: process.env.DB_NAME, // ex: myapp
  waitForConnections: true,
  connectionLimit: 10, // 동시에 연결 가능한 수 제한
  queueLimit: 0, // 0 = 무제한 대기열
});

module.exports = pool;
