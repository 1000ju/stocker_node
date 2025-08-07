/ 📁 src/controllers/theory.controller.js

// 서비스 로직 불러오기
const theoryService = require("../services/theory.service");

/**
 * 📌 [POST] /api/theory/enter
 * 특정 챕터에 들어갈 때 이론 슬라이드를 불러오는 컨트롤러
 */
exports.enterTheory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapter_id } = req.body;

    if (!chapter_id) {
      return res.status(400).json({ message: "chapter_id는 필수입니다." });
    }

    const response = await theoryService.getTheorySlides(userId, chapter_id);
    return res.status(200).json(response);
  } catch (error) {
    console.error("이론 진입 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

/**
 * 📌 [PATCH] /api/theory/progress
 * 슬라이드 넘길 때 현재 이론 페이지를 업데이트
 */
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapter_id, current_theory_id } = req.body;

    if (!chapter_id || !current_theory_id) {
      return res.status(400).json({ message: "chapter_id와 current_theory_id는 필수입니다." });
    }

    await theoryService.updateCurrentTheory(userId, chapter_id, current_theory_id);
    return res.status(200).json({ message: "현재 이론 페이지 저장 완료" });
  } catch (error) {
    console.error("이론 진도 갱신 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

/**
 * 📌 [PATCH] /api/theory/complete
 * 마지막 슬라이드에서 이론 학습 완료 처리
 */
exports.completeTheory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chapter_id } = req.body;

    if (!chapter_id) {
      return res.status(400).json({ message: "chapter_id는 필수입니다." });
    }

    await theoryService.markTheoryComplete(userId, chapter_id);
    return res.status(200).json({ message: "이론 학습 완료 처리 완료" });
  } catch (error) {
    console.error("이론 완료 처리 오류:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};