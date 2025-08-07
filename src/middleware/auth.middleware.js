// 📁 src/auth/auth.middleware.js

const jwt = require("jsonwebtoken");
const jwtUtil = require("../utils/jwt.util");
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
    // 1. access token 검증 시도
    const decoded = jwtUtil.verifyAccessToken(token);

    if (!decoded) throw new Error("만료 또는 변조된 토큰");

    req.user = decoded;
    return next();
  } catch (err) {
    // 2. access token 만료 → refresh token 있으면 재발급 시도
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        // refreshToken 검증 및 새 access token 발급
        const newAccessToken = jwtUtil.reissueAccessToken(refreshToken);

        // 프론트로 새 access token을 전달 (ex: 헤더)
        res.setHeader("x-access-token", newAccessToken);

        // 새 access token으로 payload 복호화해서 req.user 설정
        const decoded = jwtUtil.verifyAccessToken(newAccessToken);
        req.user = decoded;

        return next();
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Refresh 토큰이 유효하지 않습니다." });
      }
    }

    // 3. 그 외는 인증 실패 처리
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;
