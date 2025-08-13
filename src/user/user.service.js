const bcrypt = require("bcrypt");
const db = require("../model"); // src/model/index.js
const jwtUtil = require("../utils/jwt.util");
const { use } = require("./user.route");
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

/**
 * ✅ 유저 프로필 수정
 * @param {number} userId - 컨트롤러에서 추출해 넘겨주는 유저 ID
 * @param {object} updates - 요청 body(JSON) 그대로
 */
exports.updateProfile = async (userId, updates) => {
  // 1) 존재하는 유저인지 확인
  const exists = await User.findByPk(userId);
  if (!exists) throw new Error("존재하지 않는 사용자입니다.");

  // 2) 수정 허용 필드 화이트리스트
  const allowedFields = [
    "nickname",
    "profile_image_url",
    "age",
    "occupation",
    "provider",
  ];

  // 3) updates에서 허용된 필드만 추출
  const payload = {};
  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      payload[field] = updates[field];
    }
  });

  // 4) 변경할 항목이 없으면 에러
  if (Object.keys(payload).length === 0) {
    throw new Error("수정할 항목이 없습니다.");
  }

  // 5) DB 업데이트 실행
  await User.update(payload, { where: { id: userId } });

  // 6) 갱신된 데이터 재조회(민감정보 제외)
  const updated = await User.findByPk(userId, {
    attributes: [
      "id",
      "email",
      "nickname",
      "profile_image_url",
      "provider",
      "age",
      "occupation",
      "created_date",
    ],
  });

  return updated;
};
