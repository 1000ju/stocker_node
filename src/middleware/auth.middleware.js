const jwtUtil = require("../utils/jwt.util");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["x-refresh-token"];
  const ACCESS_SECRET = process.env.ACCESS_SECRET;

  console.log("=== [AUTH DEBUG] ===");
  console.log("Authorization Header:", authHeader);
  console.log("ACCESS_SECRET:", ACCESS_SECRET);

  // 1) 토큰 존재 여부 확인
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🚫 토큰이 제공되지 않음");
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  const token = authHeader.split(" ")[1];
  console.log("받은 Access Token:", token);

  try {
    // 2) Access Token 검증
    const decoded = jwtUtil.verifyAccessToken(token);
    if (!decoded) {
      throw new Error("만료 또는 변조된 토큰");
    }

    req.user = decoded;
    console.log("✅ 토큰 인증 성공, req.user:", req.user);
    console.log("=====================");

    return next(); // ✅ 반드시 next 호출
  } catch (err) {
    // 3) Access Token 만료 시 Refresh Token 재발급
    if (refreshToken) {
      try {
        const newAccessToken = await jwtUtil.reissueAccessToken(refreshToken);

        res.setHeader("x-access-token", newAccessToken);

        const decoded = jwtUtil.verifyAccessToken(newAccessToken);
        req.user = decoded;

        console.log("✅ Refresh 토큰으로 Access 토큰 재발급 성공");
        return next();
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Refresh 토큰이 유효하지 않습니다." });
      }
    }

    console.log("❌ 인증 실패:", err.message);
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;
