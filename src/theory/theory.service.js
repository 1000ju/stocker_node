// 📁 src/services/theory.service.js

const { Theory, ChapterProgress } = require("../model");

/**
 * 📌 이론 슬라이드 진입 시 전체 페이지 + 현재 진도 반환
 */
exports.getTheorySlides = async (userId, chapterId) => {
  // 1. 해당 챕터의 모든 이론 페이지 불러오기
  const theoryPages = await Theory.findAll({
    where: { chapter_id: chapterId },
    attributes: ["id", "Word", "content"],
    order: [["id", "ASC"]],
    raw: true,
  });

  // 2. 유저의 진도 정보 가져오기
  let progress = await ChapterProgress.findOne({
    where: { user_id: userId, chapter_id: chapterId },
  });

  // 3. 없으면 진도 초기화 (처음 입장 시)
  if (!progress) {
    progress = await ChapterProgress.create({
      user_id: userId,
      chapter_id: chapterId,
      current_theory_id: theoryPages[0]?.id || null,
    });
  }

  return {
    theory_pages: theoryPages.map((page, index) => ({
      page_no: index + 1,
      ...page,
    })),
    total_pages: theoryPages.length,
    current_page: progress.current_theory_id,
  };
};

/**
 * 📌 슬라이드 넘기면서 현재 이론 페이지 저장
 */
exports.updateCurrentTheory = async (userId, chapterId, theoryId) => {
  await ChapterProgress.update(
    { current_theory_id: theoryId },
    { where: { user_id: userId, chapter_id: chapterId } }
  );
};

/**
 * 📌 이론 마지막 슬라이드에서 완료 처리
 */
exports.markTheoryComplete = async (userId, chapterId) => {
  // 1. 이론 완료 처리
  await ChapterProgress.update(
    { is_theory_completed: true },
    { where: { user_id: userId, chapter_id: chapterId } }
  );

  // 2. 퀴즈도 완료했는지 확인해서 챕터 완료 처리
  const progress = await ChapterProgress.findOne({
    where: { user_id: userId, chapter_id: chapterId },
    attributes: ["is_quiz_completed"]
  });

  // 3. 퀴즈도 완료된 상태라면 챕터 완료 처리
  if (progress && progress.is_quiz_completed) {
    await ChapterProgress.update(
      { is_chapter_completed: true },
      { where: { user_id: userId, chapter_id: chapterId } }
    );
  }
};
