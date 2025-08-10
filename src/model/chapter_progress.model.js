module.exports = (sequelize, DataTypes) => {
  const ChapterProgress = sequelize.define(
    "ChapterProgress",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_theory_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_quiz_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      current_theory_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      current_quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "chapter_progress", // ✅ DB 실제 테이블명 지정
      timestamps: false, // createdAt, updatedAt 컬럼 없으면 필수
    }
  );

  ChapterProgress.associate = (models) => {
    ChapterProgress.belongsTo(models.User, {
      foreignKey: "user_id",
    });

    ChapterProgress.belongsTo(models.Chapter, {
      foreignKey: "chapter_id",
    });
  };

  return ChapterProgress;
};
