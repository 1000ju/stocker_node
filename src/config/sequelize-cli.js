// 컨테이너에서는 이미 환경변수가 들어오므로 없어도 OK.
// 로컬에서 CLI 돌릴 땐 아래처럼 NODE_ENV에 따라 읽어도 됨.
const fs = require("fs");
const path = require("path");
const envPath =
  process.env.NODE_ENV === "production" && fs.existsSync(".env.production")
    ? ".env.production"
    : fs.existsSync(".env")
    ? ".env"
    : null;
if (envPath) require("dotenv").config({ path: envPath });

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 3306, // ← 숫자화
  dialect: "mysql",
  logging: false,
  timezone: "+09:00",
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
