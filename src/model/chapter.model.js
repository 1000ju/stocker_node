module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define(
    "Chapter",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "chapter", // ✅ 실제 DB 테이블명 강제 지정
      timestamps: false     // ✅ DB에 createdAt/updatedAt 없으면 추가
    }
  );

  Chapter.associate = (models) => {
    Chapter.hasMany(models.Theory, {
      foreignKey: "chapter_id",
      onDelete: "CASCADE",
    });

    Chapter.hasMany(models.ChapterProgress, {
      foreignKey: "chapter_id",
      onDelete: "CASCADE",
    });
  };

  return Chapter;
};
