// 📁 src/auth/auth.middleware.js
const jwtUtil = require("../utils/jwt.util");
require("dotenv").config(); // .env 파일에서 ACCESS_SECRET 불러오기

/**
 * ✅ JWT 검증 미들웨어 -> 인증이 필요한 라우팅에서 사용된다.
 * 요청의 Authorization 헤더에 담긴 JWT를 검증하고
 * 성공 시 사용자 정보를 req.user에 담아 다음 미들웨어로 넘긴다
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["x-refresh-token"]; // 추가
  console.log("refreshToken from headers : ", refreshToken);

  // 📌 헤더가 없거나 'Bearer' 형식이 아닌 경우
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  const token = authHeader.split(" ")[1]; // Bearer 다음 공백 이후 토큰 추출

  try {
    const decoded = jwtUtil.verifyAccessToken(token);

    if (!decoded) throw new Error("만료 또는 변조된 토큰");

    req.user = decoded;
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

    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;
