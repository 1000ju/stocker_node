const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const dbConfig = require("../config/db"); // DB 연결 설정
const db = {};

// 1. Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect, // 반드시 dbConfig에 'mysql' 등 명시
    logging: false,
    dialect: dbConfig.dialect,
    dialect: 'mysql',
    logging: false, // 콘솔에 SQL문 안 보이게
  }
);

// 2. model 폴더 안의 모든 .js 파일(본인 제외) 불러오기
fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    // 함수로 export된 모델만 import 가능!
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// 3. 모델 간 관계(associate) 정의가 있으면 실행
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 4. export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
