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
    const id = await userService.signupUser(req.body);
    res.status(201).json({ message: "회원가입 성공", userId: id });
  } catch (err) {
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

    // 세션이 아니라 토큰을 응답으로 전달
    res.status(200).json({
      message: "로그인 성공",
      user,
    });
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
exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    await userService.logoutUser(email);
    res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    res.status(500).json({ message: "로그아웃 실패" });
  }
};

// 프로필 수정 컨트롤러
exports.updateMyProfile = async (req, res) => {
  try {
    const updated = await userService.updateProfile(req.user.id, req.body);
    res.json({
      message: "프로필이 업데이트되었습니다.",
      user: updated,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
