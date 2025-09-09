const { Quiz, ChapterProgress } = require("../model");
const { sequelize } = require("../model");
const wrongNoteService = require("../wrong_note/wrong_note.service");

/**
 * 📌 퀴즈 진입: 문제 리스트 + 현재 위치 반환
 */
exports.getQuizList = async (userId, chapterId) => {
  const cid = Number(chapterId);

  const quizzes = await Quiz.findAll({
    where: { chapter_id: cid },
    attributes: ["id","chapter_id","question","option_1","option_2","option_3","option_4","correct_option","hint"],
    order: [["id","ASC"]],
    raw: true,
  });

  // 퀴즈가 아예 없으면 안전하게 반환
  if (!quizzes.length) {
    await ChapterProgress.findOrCreate({
      where: { user_id: userId, chapter_id: cid },
      defaults: { current_quiz_id: null },
    });
    return { chapter_id: cid, quiz_list: [], current_quiz_id: null };
  }

  const firstId = Number(quizzes[0].id);

  // 기존 진도 조회
  let progress = await ChapterProgress.findOne({
    where: { user_id: userId, chapter_id: cid },
  });

  if (!progress) {
    // 첫 진입: 첫 문제로 초기화
    progress = await ChapterProgress.create({
      user_id: userId,
      chapter_id: cid,
      current_quiz_id: firstId,
    });
  } else if (progress.current_quiz_id == null) {
    // 🔴 핵심 보정
    await progress.update({ current_quiz_id: firstId });
  }

  return {
    chapter_id: cid,
    quiz_list: quizzes,
    current_quiz_id: Number(progress.current_quiz_id ?? firstId),
  };
};

/**
 * 📌 퀴즈 중간 저장 (현재 위치 저장)
 */
exports.saveQuizProgress = async (userId, chapterId, quizId) => {
  await ChapterProgress.update(
    { current_quiz_id: Number(quizId) },
    { where: { user_id: userId, chapter_id: Number(chapterId) } }
  );
};

/**
 * 📌 퀴즈 완료: 채점 + 오답 교체 저장(selected_option 포함) + 완료 처리
 */
exports.submitQuiz = async (userId, chapterId, answers) => {
  const cid = Number(chapterId);

  return await sequelize.transaction(async (t) => {
    // 1) 챕터 퀴즈 로드 (정답만 필요)
    const quizzes = await Quiz.findAll({
      where: { chapter_id: cid },
      attributes: ["id", "correct_option"],
      raw: true,
      transaction: t,
    });

    // 2) 타입 정규화
    const correctMap = new Map(
      quizzes.map(q => [Number(q.id), Number(q.correct_option)])
    );

    const answersNorm = (answers || []).map(a => ({
      quiz_id: Number(a.quiz_id),
      selected_option:
        (a.selected_option === null || a.selected_option === undefined)
          ? null
          : Number(a.selected_option),
    }));

    const answersMap = new Map(
      answersNorm.map(a => [a.quiz_id, a.selected_option])
    );

    // 3) 채점 + 오답 수집(selected_option 그대로)
    let correctCount = 0;
    const wrongItems = [];

    for (const q of quizzes) {
      const qid = Number(q.id);
      const selected = answersMap.get(qid);    // number | null | undefined
      const correct  = correctMap.get(qid);    // number

      if (selected !== null && selected !== undefined && selected === correct) {
        correctCount += 1;
      } else {
        wrongItems.push({ quiz_id: qid, selected_option: selected ?? null });
      }
    }

    // 4) 완주 시 오답노트 교체 저장 (기존 삭제 → 새 세트 삽입)
    await wrongNoteService.replaceForChapter(userId, cid, wrongItems);

    // 5) 진도 완료 처리 (포인터 초기화 포함)
    await ChapterProgress.update(
      { is_quiz_completed: true, current_quiz_id: null },
      { where: { user_id: userId, chapter_id: cid }, transaction: t }
    );

    // 6) 이론도 완료했는지 확인해서 챕터 완료 처리
    const progress = await ChapterProgress.findOne({
      where: { user_id: userId, chapter_id: cid },
      attributes: ["is_theory_completed"],
      transaction: t
    });

    // 7) 이론도 완료된 상태라면 챕터 완료 처리
    if (progress && progress.is_theory_completed) {
      await ChapterProgress.update(
        { is_chapter_completed: true },
        { where: { user_id: userId, chapter_id: cid }, transaction: t }
      );
    }

    return {
      total: quizzes.length,
      correct: correctCount,
      wrong: quizzes.length - correctCount,
    };
  });
};

exports.getHint = async (req, res) => {
  const quizId = parseInt(req.body.quiz_id, 10);
  if (isNaN(quizId)) return res.status(400).json({ message: "quiz_id는 숫자여야 합니다." });
  const hint = await quizService.getHintById(quizId);
  if (!hint) return res.status(404).json({ message: "해당 퀴즈를 찾을 수 없습니다." });
  return res.status(200).json({ quiz_id: quizId, hint });
};

exports.getHintById = async (quizId) => {
  const quiz = await Quiz.findOne({
    where: { id: quizId },
    attributes: ["hint"],
    raw: true,
  });
  return quiz ? quiz.hint : null;
};