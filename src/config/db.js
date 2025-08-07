// config/db.js
require("dotenv").config();

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: "mysql", // 반드시 명시!
  logging: false, // 원하면 true/false 조절
  // 필요 시 pool 등 옵션 추가 가능
};
