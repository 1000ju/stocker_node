// 📁 src/wrong_note/wrong_note.service.js
const { sequelize, WrongNote, Quiz } = require("../model");

/** 오답노트 조회 (user_id + 선택적 chapter_id) */
async function getWrongNoteList(userId, chapterId = null) {
  // chapterId가 제공되지 않으면 모든 챕터의 오답노트 조회
  const whereClause = { user_id: userId };
  if (chapterId) {
    whereClause.chapter_id = Number(chapterId);
  }

  const rows = await WrongNote.findAll({
    where: whereClause,
    include: [
      {
        model: Quiz,
        attributes: [
          "id",
          "chapter_id",
          "question",
          "option_1",
          "option_2",
          "option_3",
          "option_4",
          "correct_option",
        ],
        required: true,
      },
    ],
    order: [["created_date", "DESC"]],
  });

  return rows.map((n) => ({
    id: n.id, // ✅ 오답노트 ID 추가
    quiz_id: n.Quiz?.id,
    chapter_id: n.Quiz?.chapter_id ?? n.chapter_id,
    user_id: n.user_id, // ✅ 사용자 ID 추가
    question: n.Quiz?.question,
    options: [
      n.Quiz?.option_1,
      n.Quiz?.option_2, 
      n.Quiz?.option_3,
      n.Quiz?.option_4,
    ].filter(option => option !== null), // null 값 제거
    correct_option: n.Quiz?.correct_option,
    selected_option: n.selected_option, // ✅ 선택값 반환 (1-based)
    created_date: n.created_date,
    // ✅ 추가 정보 (Flutter에서 활용 가능)
    explanation: n.Quiz?.explanation || null,
    chapter_title: `챕터 ${n.Quiz?.chapter_id ?? n.chapter_id}`, // 임시 제목
  }));
}

/**
 * 퀴즈 "완주" 시 교체: 기존 삭제 → 새 오답 세트 삽입
 * wrongItems: [{ quiz_id, selected_option }]
 */
async function replaceForChapter(userId, chapterId, wrongItems = []) {
  if (!chapterId) {
    const err = new Error("chapter_id는 필수입니다.");
    err.status = 400;
    throw err;
  }

  return await sequelize.transaction(async (t) => {
    await WrongNote.destroy({
      where: { user_id: userId, chapter_id: Number(chapterId) },
      transaction: t,
    });

    if (wrongItems.length > 0) {
      const now = new Date();
      const payload = wrongItems.map((w) => ({
        user_id: userId,
        chapter_id: Number(chapterId),
        quiz_id: w.quiz_id,
        selected_option: w.selected_option ?? null, // ✅ 선택값 저장
        created_date: now,
      }));
      await WrongNote.bulkCreate(payload, { transaction: t });
    }

    return { replaced: true, count: wrongItems.length };
  });
}

// 내보내기 (혼용 방지용으로 둘 다 제공)
module.exports = { getWrongNoteList, replaceForChapter };
exports.getWrongNoteList = getWrongNoteList;
exports.replaceForChapter = replaceForChapter;
