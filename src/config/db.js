// src/config/db.js
require("dotenv").config();

/**
 * 🐳 Docker Compose 환경에서는 DB 컨테이너의 서비스명이 곧 호스트명입니다.
 *    - compose.yml에서 db 서비스명을 "db"로 두면 DB_HOST가 비어있을 때 기본값 'db' 사용
 * ✅ 로컬 MySQL을 쓸 땐 .env에 DB_HOST=localhost 로 덮어쓰면 됩니다.
 */
module.exports = {
  host: process.env.DB_HOST || "db", // 🐳 기본값 'db'
  port: Number(process.env.DB_PORT) || 3306, // ✅ 포트 추가
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || "mysql", // ✅ env가 없으면 mysql
  logging: false,
  timezone: "+09:00", // ✅ KST
  // 🐳 운영 안정화를 위한 풀 설정(선택)
  pool: { max: 10, min: 0, acquire: 20000, idle: 10000 },
};
