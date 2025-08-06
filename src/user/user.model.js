// 📁 src/user/user.model.js

// ✅ DB 연결 객체 불러오기 (mysql2 기반 커넥션 풀)
const db = require("../config/db");

// ✅ 사용자 관련 DB 쿼리들을 담당하는 모델 객체
const UserModel = {
  /**
   * 📌 회원가입: 새 유저를 users 테이블에 INSERT
   * @param {Object} user - 사용자 정보 객체
   * @returns {Number} insertId - 새로 생성된 사용자의 ID (Primary Key)
   */
  createUser: async ({
    email,
    password,
    nickname,
    profile_image_url,
    provider,
    age,
    occupation,
  }) => {
    const query = `
      INSERT INTO user 
        (email, password, nickname, profile_image_url, provider, age, occupation, created_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      email,
      password,
      nickname,
      profile_image_url,
      provider,
      age,
      occupation,
    ];

    // 📌 쿼리 실행, 결과는 배열 형태 [rows, fields]
    const [result] = await db.execute(query, values);

    // 📌 삽입된 행의 ID 반환 (AUTO_INCREMENT된 PK)
    return result.insertId;
  },

  /**
   * 📌 로그인 시 사용: 이메일로 유저 조회 (SELECT)
   * @param {String} email - 로그인 시 입력한 이메일
   * @returns {Object|null} 유저 정보 객체 or null
   */
  findByEmail: async (email) => {
    const query = `SELECT * FROM user WHERE email = ?`;

    // 📌 이메일은 UNIQUE 설정되어 있으므로 1개만 반환됨
    const [rows] = await db.execute(query, [email]);

    // 📌 없으면 undefined 반환됨 → 이후 서비스에서 처리
    return rows[0];
  },

  /**
   * 📌 로그아웃 시 사용: access_token, refresh_token NULL 처리
   * @param {String} email - 토큰을 지울 대상 사용자 이메일
   */
  clearTokens: async (email) => {
    const query = `
      UPDATE user 
      SET access_token = NULL, refresh_token = NULL
      WHERE email = ?
    `;

    await db.execute(query, [email]);
  },

  /**
   * 📌 로그인 성공 시 access/refresh 토큰 저장
   * @param {String} email - 사용자 이메일
   * @param {String} access_token - 액세스 토큰
   * @param {String} refresh_token - 리프레시 토큰
   */
  saveTokens: async (email, access_token, refresh_token) => {
    const query = `
      UPDATE user
      SET access_token = ?, refresh_token = ?
      WHERE email = ?
    `;

    await db.execute(query, [access_token, refresh_token, email]);
  },
};

// ✅ 외부에서 UserModel을 사용할 수 있게 export
module.exports = UserModel;
