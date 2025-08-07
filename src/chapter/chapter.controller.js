// 📁 src/controllers/chapter.controller.js

// 챕터 관련 서비스 함수 불러오기
const chapterService = require("../services/chapter.service");

/**
 * 📌 챕터 목록 조회 컨트롤러
 * - 요청한 유저의 토큰에서 userId를 추출
 * - 챕터 전체 목록 + 해당 유저의 진도 정보를 함께 응답
 */
exports.getChapters = async (req, res) => {
  try {
    const userId = req.user.id; // 인증 미들웨어에서 설정한 유저 ID

    // 서비스 함수 호출하여 챕터 목록 + 유저 진도 정보 가져오기
    const chapters = await chapterService.getChaptersWithProgress(userId);

    // 성공 응답 전송
    res.status(200).json(chapters);
  } catch (error) {
    // 에러 발생 시 500 에러 응답
    console.error("챕터 목록 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
