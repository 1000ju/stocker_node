const { Quiz, ChapterProgress, WrongNote } = require("../models");

/**
 * 📌 퀴즈 진입: 문제 리스트 + 현재 위치 반환
 */
exports.getQuizList = async (userId, chapterId) => {
  const quizzes = await Quiz.findAll({
    where: { chapter_id: chapterId },
    attributes: ["id", "question", "option_1", "option_2", "option_3", "option_4"],
    order: [["id", "ASC"]],
    raw: true,
  });

  let progress = await ChapterProgress.findOne({
    where: { user_id: userId, chapter_id: chapterId },
  });

  // 처음이라면 진도 생성 + 첫 문제로 설정
  if (!progress) {
    progress = await ChapterProgress.create({
      user_id: userId,
      chapter_id: chapterId,
      current_quiz_id: quizzes[0]?.id || null,
    });
  }

  return {
    chapter_id: chapterId,
    quiz_list: quizzes,
    current_quiz_id: progress.current_quiz_id,
  };
};

/**
 * 📌 퀴즈 중간 저장 (현재 위치 저장)
 */
exports.saveQuizProgress = async (userId, chapterId, quizId) => {
  await ChapterProgress.update(
    { current_quiz_id: quizId },
    { where: { user_id: userId, chapter_id: chapterId } }
  );
};

/**
 * 📌 퀴즈 완료: 채점 + 오답 저장 + 완료 처리
 */
exports.submitQuiz = async (userId, chapterId, answers) => {
  // 1. 해당 챕터의 퀴즈 모두 불러오기 (정답 확인용)
  const quizzes = await Quiz.findAll({
    where: { chapter_id: chapterId },
    raw: true,
  });

  // 2. 기존 오답노트 제거 (최신화 목적)
  await WrongNote.destroy({
    where: { user_id: userId, chapter_id: chapterId },
  });

  let correctCount = 0;
  const wrongList = [];

  // 3. 정답 비교 후 오답 저장할 목록 만들기
  for (const quiz of quizzes) {
    const userAnswer = answers.find((a) => a.quiz_id === quiz.id);
    const isCorrect = userAnswer && userAnswer.selected_option === quiz.correct_option;

    if (isCorrect) {
      correctCount++;
    } else {
      wrongList.push({
        user_id: userId,
        chapter_id: chapterId,
        quiz_id: quiz.id,
      });
    }
  }

  // 4. 오답노트 저장 (틀린 문제만)
  if (wrongList.length > 0) {
    await WrongNote.bulkCreate(wrongList);
  }

  // 5. 진도 완료 처리
  await ChapterProgress.update(
    { is_quiz_completed: true },
    { where: { user_id: userId, chapter_id: chapterId } }
  );

  return {
    total: quizzes.length,
    correct: correctCount,
    wrong: quizzes.length - correctCount,
  };
};
