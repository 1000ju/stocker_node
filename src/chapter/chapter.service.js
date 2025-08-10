// 📁 src/services/chapter.service.js

// Sequelize 모델들 불러오기
const { Chapter, ChapterProgress } = require("../model");

/**
 * 📌 챕터 목록 + 유저의 진도 상태 함께 가져오기
 * @param {number} userId - 토큰에서 추출된 유저 ID
 * @returns {Array} 챕터 + 진도 정보 배열
 */
exports.getChaptersWithProgress = async (userId) => {
  // 1. 전체 챕터 조회 (id, title, description만)
  const chapters = await Chapter.findAll({
    attributes: ["id", "title", "keyword"],
    raw: true, // 깔끔한 JSON 결과 반환
  });

  // 2. 해당 유저의 모든 챕터 진도 조회
  const progressList = await ChapterProgress.findAll({
    where: { user_id: userId },
    attributes: ["chapter_id", "is_theory_completed", "is_quiz_completed"],
    raw: true,
  });

  // 3. 진도 정보를 챕터 목록에 매핑해서 합치기
  const progressMap = {}; // { chapter_id: { ...진도정보 } }
  progressList.forEach((progress) => {
    progressMap[progress.chapter_id] = progress;
  });

  // 4. 챕터 + 진도 합친 결과 생성
  const result = chapters.map((chapter) => {
    const progress = progressMap[chapter.id] || {}; // 진도 없으면 빈 객체
    return {
      chapter_id: chapter.id,
      title: chapter.title,
      keyword: chapter.keyword,
      is_theory_completed: progress.is_theory_completed || false,
      is_quiz_completed: progress.is_quiz_completed || false,
    };
  });

  return result;
};
