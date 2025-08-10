// // 📁 src/user/user.controller.js

// // 🔗 사용자 서비스 로직 불러오기
// const userService = require("./user.service");

// /**
//  * ✅ 회원가입 컨트롤러
//  * @route   POST /api/users/register
//  * @desc    클라이언트로부터 받은 회원가입 정보를 기반으로 DB에 사용자 생성
//  * @access  Public
//  */
// exports.signup = async (req, res) => {
//   try {
//     const id = await userService.signupUser(req.body);
//     res.status(201).json({ message: "회원가입 성공", userId: id });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * ✅ 로그인 컨트롤러
//  * @route   POST /api/users/login
//  * @desc    이메일과 비밀번호로 로그인 처리, 세션에 사용자 정보 저장
//  * @access  Public
//  */
// exports.login = async (req, res) => {
//   try {
//     // 📥 요청 바디에서 로그인 정보 추출
//     const { email, password } = req.body;

//     // 🔐 서비스 로직으로 사용자 검증 (비밀번호 비교 등)
//     const user = await userService.loginUser(email, password);

//     // 세션이 아니라 토큰을 응답으로 전달
//     res.status(200).json({
//       message: "로그인 성공",
//       user,
//     });
//   } catch (err) {
//     // ⚠️ 이메일 또는 비밀번호 불일치
//     res.status(401).json({ message: err.message });
//   }
// };

// /**
//  * ✅ 로그아웃 컨트롤러
//  * @route   POST /api/users/logout
//  * @desc    세션 종료 및 DB 내 저장된 토큰 제거
//  * @access  Private (로그인한 사용자만 가능)
//  */
// exports.logout = async (req, res) => {
//   try {
//     const { email } = req.body;
//     await userService.logoutUser(email);
//     res.status(200).json({ message: "로그아웃 성공" });
//   } catch (err) {
//     res.status(500).json({ message: "로그아웃 실패" });
//   }
// };

// 📁 src/user/user.controller.js
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
      token: accessToken,          // ← Postman에서 Authorization: Bearer {{token}} 로 사용
      refreshToken,                // 선택 사용
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
