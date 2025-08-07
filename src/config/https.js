// 📁 src/config/https.js

const fs = require("fs");
const path = require("path");
const https = require("https");

// ✅ SSL 인증서 경로 지정 (🔐 HTTPS 보안 통신에 필요)
const privateKey = fs.readFileSync(
  path.join(__dirname, "../../ssl/key.pem"), // 🔸 개인 키 파일
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "../../ssl/cert.pem"), // 🔸 인증서 파일
  "utf8"
);

// ✅ 인증서 객체 생성
const credentials = {
  key: privateKey,
  cert: certificate,
};

// ✅ Express 앱을 받아 HTTPS 서버 생성 함수로 export
const createHttpsServer = (app) => {
  return https.createServer(credentials, app);
};

module.exports = createHttpsServer;
