// 📁 src/user/user.controller.js

// 🔗 사용자 서비스 로직 불러오기
const userService = require("./user.service");

/**
 * ✅ 회원가입 컨트롤러
 * @route   POST /api/users/register
 * @desc    클라이언트로부터 받은 회원가입 정보를 기반으로 DB에 사용자 생성
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    // 📥 클라이언트로부터 받은 회원가입 정보 파싱
    const {
      email,
      password,
      nickname,
      profile_image_url,
      provider,
      age,
      occupation,
    } = req.body;

    // 🔧 서비스에 회원가입 요청 → DB에 INSERT 수행
    const userId = await userService.signupUser({
      email,
      password,
      nickname,
      profile_image_url,
      provider,
      age,
      occupation,
    });

    // ✅ 회원가입 성공 응답
    res.status(201).json({ message: "회원가입 성공", userId });
  } catch (err) {
    // ⚠️ 유효성 실패, 중복 이메일 등 오류 처리
    res.status(400).json({ message: err.message });
  }
};

/**
 * ✅ 로그인 컨트롤러
 * @route   POST /api/users/login
 * @desc    이메일과 비밀번호로 로그인 처리, 세션에 사용자 정보 저장
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    // 📥 요청 바디에서 로그인 정보 추출
    const { email, password } = req.body;

    // 🔐 서비스 로직으로 사용자 검증 (비밀번호 비교 등)
    const user = await userService.loginUser(email, password);

    // 🗂️ 로그인 성공 → 세션에 사용자 정보 저장
    req.session.user = user;

    // ✅ 로그인 성공 응답
    res.status(200).json({ message: "로그인 성공", user });
  } catch (err) {
    // ⚠️ 이메일 또는 비밀번호 불일치
    res.status(401).json({ message: err.message });
  }
};

/**
 * ✅ 로그아웃 컨트롤러
 * @route   POST /api/users/logout
 * @desc    세션 종료 및 DB 내 저장된 토큰 제거
 * @access  Private (로그인한 사용자만 가능)
 */
exports.logout = (req, res) => {
  // 🔐 세션에 사용자 정보가 없을 경우 (비로그인 상태)
  if (!req.session.user) {
    return res.status(400).json({ message: "로그인 상태가 아닙니다." });
  }

  // 📌 세션에서 사용자 이메일 추출
  const email = req.session.user.email;

  // 🧹 세션 파기
  req.session.destroy(async (err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });

    try {
      // 🔧 DB에 저장된 토큰 제거
      await userService.logoutUser(email);

      // ✅ 로그아웃 성공 응답
      res.status(200).json({ message: "로그아웃 완료" });
    } catch (err) {
      // ⚠️ DB 업데이트 중 에러
      res.status(500).json({ message: "DB 토큰 삭제 실패" });
    }
  });
};
