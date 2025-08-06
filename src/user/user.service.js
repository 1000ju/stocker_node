// 📁 src/user/user.service.js
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");

/**
 * ✅ 회원가입 서비스
 * @param {Object} userData - 회원가입 폼에서 받은 사용자 정보
 * @returns {Number} 새 유저의 ID
 */
exports.signupUser = async (userData) => {
  const existingUser = await userModel.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("이미 등록된 이메일입니다.");
  }

  // 📌 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // 📌 해시된 비밀번호로 덮어쓰기
  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword,
  };

  // 📌 DB에 사용자 저장
  const userId = await userModel.createUser(userWithHashedPassword);
  return userId;
};

/**
 * ✅ 로그인 서비스
 * @param {String} email
 * @param {String} password
 * @returns {Object} 로그인 성공한 사용자 정보
 */
exports.loginUser = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error("존재하지 않는 이메일입니다.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("비밀번호가 일치하지 않습니다.");

  // ✅ 로그인 성공 → 필요한 정보만 반환
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  // 아마 여기에서 로그인 하고 access, refresh 토큰을 만들어서 saveToken하는 부분일 것임 ***********
};

/**
 * ✅ 로그아웃 서비스
 * @param {String} email - 로그아웃할 사용자 이메일
 */
exports.logoutUser = async (email) => {
  await userModel.clearTokens(email);
};
