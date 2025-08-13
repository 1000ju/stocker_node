const bcrypt = require("bcrypt");
const db = require("../model"); // src/model/index.js
const jwtUtil = require("../utils/jwt.util");
const User = db.User;

/**
 * ✅ 회원가입 서비스
 * @param {Object} userData - 회원가입 폼에서 받은 사용자 정보
 * @returns {Number} 새 유저의 ID
 */
exports.signupUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error("이미 등록된 이메일입니다.");
  }

  // 📌 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  // 📌 해시된 비밀번호로 덮어쓰기
  userData.password = hashedPassword;

  // 📌 DB에 사용자 저장
  const user = await User.create(userData);
  return user.id;
};

/**
 * ✅ 로그인 서비스
 * @param {String} email
 * @param {String} password
 * @returns {Object} 로그인 성공한 사용자 정보
 */
exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("존재하지 않는 이메일입니다.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("비밀번호가 일치하지 않습니다.");

  // ✅ JWT 발급
  // plain object로 변환
  const userObj = user.get
    ? user.get({ plain: true })
    : { id: user.id, email: user.email, nickname: user.nickname };

  // AccessToken/RefreshToken 발급 시
  const accessToken = jwtUtil.createAccessToken({
    id: userObj.id,
    email: userObj.email,
    nickname: userObj.nickname,
  });
  const refreshToken = jwtUtil.createRefreshToken({
    id: userObj.id,
  });

  await User.update(
    { access_token: accessToken, refresh_token: refreshToken },
    { where: { email } }
  );

  // ✅ 로그인 성공 → 필요한 정보만 반환
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  // 여기서 access/refresh 토큰 발급 및 저장 로직도 추가 가능
};

/**
 * ✅ 로그아웃 서비스
 * @param {String} email - 로그아웃할 사용자 이메일
 */
exports.logoutUser = async (email) => {
  await User.update(
    { access_token: null, refresh_token: null },
    { where: { email } }
  );
};
