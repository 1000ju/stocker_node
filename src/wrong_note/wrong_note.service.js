// 📁 src/services/wrongNote.service.js

const { WrongNote, Quiz } = require("../models");

/**
 * 📌 오답노트 조회: 유저가 틀린 문제들 반환
 */
exports.getWrongNoteList = async (userId, chapterId) => {
  // 1. 오답노트 + 퀴즈 조인 조회
  const notes = await WrongNote.findAll({
    where: { user_id: userId, chapter_id: chapterId },
    include: [
      {
        model: Quiz,
        attributes: ["question", "option_1", "option_2", "option_3", "option_4", "correct_option"],
      },
    ],
  });

  // 2. 필요한 데이터만 가공해서 반환
  return notes.map((note) => ({
    quiz_id: note.quiz_id,
    question: note.Quiz.question,
    options: [
      note.Quiz.option_1,
      note.Quiz.option_2,
      note.Quiz.option_3,
      note.Quiz.option_4,
    ],
    correct_option: note.Quiz.correct_option,
  }));
};
