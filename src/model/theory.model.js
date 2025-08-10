// 📁 theory.model.js
module.exports = (sequelize, DataTypes) => {
  const Theory = sequelize.define("Theory", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    word: { // 컬럼명은 소문자 시작이 일반적
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: "theory", // DB 실제 테이블명
    timestamps: false     // createdAt, updatedAt 없으면 false
  });

  // 관계 설정 (1개의 챕터에 여러 이론이 있음)
  Theory.associate = (models) => {
    Theory.belongsTo(models.Chapter, {
      foreignKey: "chapter_id",
      onDelete: "CASCADE",
    });
  };

  return Theory;
};

