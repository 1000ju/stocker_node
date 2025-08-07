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
    Word: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
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
