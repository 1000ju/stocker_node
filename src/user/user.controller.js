const userService = require("../user/user.service");
const jwtUtil = require("../utils/jwt.util");

/**
 * 회원가입
 * POST /api/user/signup
 */
exports.signup = async (req, res) => {
  try {
    const id = await userService.signupUser(req.body);
    return res.status(201).json({ message: "회원가입 성공", userId: id });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * 로그인 + 토큰 발급
 * POST /api/user/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 검증
    const user = await userService.loginUser(email, password);

    // Access / Refresh 발급 (jwt.util.js 사용, .env의 ACCESS_SECRET/REFRESH_SECRET 필요)
    const accessToken = jwtUtil.createAccessToken({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    });
    const refreshToken = jwtUtil.createRefreshToken({ id: user.id });

    // 필요시 refreshToken을 쿠키로도 내려줄 수 있음
    // res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "lax", secure: false });

    return res.status(200).json({
      message: "로그인 성공",
      user: { id: user.id, email: user.email, nickname: user.nickname },
      token: accessToken, // ← Postman에서 Authorization: Bearer {{token}} 로 사용
      refreshToken, // 선택 사용
    });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

/**
 * 로그아웃
 * POST /api/user/logout
 */
exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    await userService.logoutUser(email);
    return res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    return res.status(500).json({ message: "로그아웃 실패" });
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
