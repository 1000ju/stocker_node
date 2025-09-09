const jwtUtil = require("../utils/jwt.util");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["x-refresh-token"];
  const ACCESS_SECRET = process.env.ACCESS_SECRET;

  // 디버그 로그는 개발 환경에서만 활성화
  if (process.env.NODE_ENV === 'development') {
    console.log("🔐 [AUTH] Token verification started");
  }

  // 1) 토큰 존재 여부 확인
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (process.env.NODE_ENV === 'development') {
      console.log("🚫 [AUTH] No token provided");
    }
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  const token = authHeader.split(" ")[1];
  
  if (process.env.NODE_ENV === 'development') {
    console.log("🔑 [AUTH] Verifying access token:", token.substring(0, 20) + "...");
  }

  try {
    // 2) Access Token 검증
    const decoded = jwtUtil.verifyAccessToken(token);
    if (!decoded) {
      throw new Error("만료 또는 변조된 토큰");
    }

    req.user = decoded;
    
    if (process.env.NODE_ENV === 'development') {
      console.log("✅ [AUTH] Token verified successfully, user:", decoded.email);
    }

    return next(); // ✅ 반드시 next 호출
  } catch (err) {
    // 3) Access Token 만료 시 Refresh Token 재발급
    if (refreshToken) {
      try {
        const newAccessToken = await jwtUtil.reissueAccessToken(refreshToken);

        res.setHeader("x-access-token", newAccessToken);

        const decoded = jwtUtil.verifyAccessToken(newAccessToken);
        req.user = decoded;

        if (process.env.NODE_ENV === 'development') {
          console.log("🔄 [AUTH] Access token refreshed successfully");
        }
        return next();
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Refresh 토큰이 유효하지 않습니다." });
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("❌ [AUTH] Authentication failed:", err.message);
    }
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = verifyToken;