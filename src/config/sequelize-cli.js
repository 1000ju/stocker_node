require("dotenv").config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "db", // 도커에선 'db'
  port: process.env.DB_PORT || 3306,
  dialect: "mysql",
  logging: false,
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
