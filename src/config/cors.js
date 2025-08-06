// 📁 src/config/cors.js

const cors = require("cors");

// ✅ CORS 정책 정의: 다른 포트/도메인의 요청 허용
const corsOptions = {
  origin: [
    "http://localhost:3000", // 🔹 프론트엔드 개발 서버 (React 등)
    // "https://your-production-frontend.com"  // 🔹 실제 배포 주소 추가 가능
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // 🔸 쿠키나 인증 정보 포함 허용 (세션/Cookie JWT 전송 시 필수)
};

module.exports = cors(corsOptions);
