'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 혹시라도 있으면 패스, 없으면 생성
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE id = 1", 
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      await queryInterface.bulkInsert('Users', [{
        id: 1,
        email: 'demo@test.com',
        nickname: '데모유저',
        password: 'password123', // 암호화가 필요하다면 맞춰서 넣어야 함
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', { id: 1 }, {});
  }
};