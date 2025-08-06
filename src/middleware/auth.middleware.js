// 📁 src/auth/auth.middleware.js

const jwt = require("jsonwebtoken");
require("dotenv").config(); // .env 파일에서 ACCESS_SECRET 불러오기

const ACCESS_SECRET = process.env.ACCESS_SECRET;

/**
 * ✅ JWT 검증 미들웨어 -> 인증이 필요한 라우팅에서 사용된다.
 * 요청의 Authorization 헤더에 담긴 JWT를 검증하고
 * 성공 시 사용자 정보를 req.user에 담아 다음 미들웨어로 넘긴다
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 📌 헤더가 없거나 'Bearer' 형식이 아닌 경우
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  const token = authHeader.split(" ")[1]; // Bearer 다음 공백 이후 토큰 추출

  try {
    // 📌 토큰 검증
    const decoded = jwt.verify(token, ACCESS_SECRET);

    // 📌 검증된 사용자 정보 req.user에 저장
    req.user = decoded;

    // ✅ 다음 미들웨어로 진행
    next();
  } catch (err) {
    // 📌 토큰이 유효하지 않거나 만료된 경우
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;
