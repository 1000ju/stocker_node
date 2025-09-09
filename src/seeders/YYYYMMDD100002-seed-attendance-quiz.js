"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("attendance_quiz", [
      { question_OX: "Java는 플랫폼 독립적인 언어이다.", is_correct: 1 },
      {
        question_OX: "Spring Boot는 JSP 기반 웹 프레임워크이다.",
        is_correct: 0,
      },
      {
        question_OX: "HTTP GET 요청은 데이터를 서버에 저장한다.",
        is_correct: 0,
      },
      { question_OX: "JWT는 JSON 기반의 토큰이다.", is_correct: 1 },
      {
        question_OX: "데이터베이스에서 Primary Key는 중복이 가능하다.",
        is_correct: 0,
      },
      {
        question_OX: "REST API는 상태를 저장하지 않는 Stateless 구조이다.",
        is_correct: 1,
      },
      {
        question_OX: "Linux에서 cd .. 는 현재 디렉토리의 하위 폴더로 이동한다.",
        is_correct: 0,
      },
      {
        question_OX: "Git은 버전 관리를 위한 분산형 시스템이다.",
        is_correct: 1,
      },
      { question_OX: "HTML은 프로그래밍 언어이다.", is_correct: 1 },
      {
        question_OX: "IntelliJ는 Java 개발에 사용되는 대표적인 IDE이다.",
        is_correct: 1,
      },
    ]);
  },
  async down(q) {
    await q.bulkDelete("attendance_quiz", null, {});
  },
};
