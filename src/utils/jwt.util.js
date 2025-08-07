// 📦 jwt.util.js

const jwt = require("jsonwebtoken");
require("dotenv").config(); // .env에서 시크릿 키 불러오기

// ✅ .env에서 시크릿 키 불러오기
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// ⚙️ JWT 유틸리티 함수 정의
const jwtUtil = {
  /**
   * ✅ Access Token 발급 (1시간 유효)
   * @param {Object} payload - 토큰에 담을 사용자 정보 (ex: { id, email, nickname })
   * @returns {String} - 서명된 JWT 문자열
   */
  createAccessToken: (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: "1h", // 1시간
    });
  },

  /**
   * ✅ Refresh Token 발급 (7일 유효)
   * @param {Object} payload - 사용자 정보 (보통 id 정도만)
   * @returns {String} - 서명된 Refresh Token
   */
  createRefreshToken: (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "7d", // 7일
    });
  },

  /**
   * ✅ Access Token 검증 함수
   * @param {String} token - 클라이언트로부터 받은 access token
   * @returns {Object|null} - 토큰이 유효하면 payload 반환, 아니면 null
   */
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      console.error("❌ Access Token 검증 실패:", err.message);
      return null;
    }
  },

  /**
   * ✅ Refresh Token 검증 함수
   * @param {String} token - 클라이언트로부터 받은 refresh token
   * @returns {Object|null} - 유효한 경우 payload 반환, 아니면 null
   */
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      console.error("❌ Refresh Token 검증 실패:", err.message);
      return null;
    }
  },

  reissueAccessToken: (refreshToken) => {
    try {
      // 1. Refresh 토큰 유효성 검사
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

      // 2. 토큰에 담긴 정보로 새로운 access 토큰 발급
      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          nickname: decoded.nickname,
        },
        ACCESS_SECRET,
        { expiresIn: "1h" } // access token은 짧게 유지
      );

      //db에 access_token도 저장해뒀지만, 성능 문제로 제대로 저장되는지만 확인하고 갱신 정보는 넣지 않을 것임
      return newAccessToken;
    } catch (err) {
      throw new Error("Refresh 토큰이 유효하지 않습니다.");
    }
  },
};

module.exports = jwtUtil;
