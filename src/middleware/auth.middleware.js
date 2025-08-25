

const jwtUtil = require("../utils/jwt.util");
require("dotenv").config();

/**
 * ✅ JWT 검증 미들웨어 -> 인증이 필요한 라우팅에서 사용된다.
 * 요청의 Authorization 헤더에 담긴 JWT를 검증하고
 * 성공 시 사용자 정보를 req.user에 담아 다음 미들웨어로 넘긴다
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["x-refresh-token"]; // 추가
  console.log("refreshToken from headers : ", refreshToken);
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("=== [AUTH DEBUG] ===");
  console.log("Authorization Header:", authHeader);
  console.log("ACCESS_SECRET (검증):", ACCESS_SECRET);

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🚫 토큰이 제공되지 않음");
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  const token = authHeader.split(" ")[1];
  console.log("받은 Access Token:", token);

  try {
    const decoded = jwtUtil.verifyAccessToken(token);
    console.log("Access Token Decoded Payload:", decoded);

    if (!decoded) {
      console.log("🚫 jwtUtil.verifyAccessToken()이 null 반환");
      throw new Error("만료 또는 변조된 토큰");
    }

    req.user = decoded;
    console.log("✅ 토큰 인증 성공, req.user:", req.user);
    console.log("=====================");
    return next();
  } catch (err) {

    // ✅ Access Token 만료 → Refresh Token으로 재발급
    if (refreshToken) {
      try {
        const newAccessToken = jwtUtil.reissueAccessToken(refreshToken);

        // 새 토큰을 헤더로 반환
        res.setHeader("x-access-token", newAccessToken);

        // 새 토큰으로 다시 payload 해석
        const decoded = jwtUtil.verifyAccessToken(newAccessToken);
        req.user = decoded;

        console.log("✅ Access Token 만료 → Refresh Token으로 재발급");

        return next();
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Refresh 토큰이 유효하지 않습니다." });
      }
    }


    console.log("❌ 인증 실패:", err.message);
    console.log("=====================");
    
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;
