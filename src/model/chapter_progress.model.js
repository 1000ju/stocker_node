module.exports = (sequelize, DataTypes) => {
  const ChapterProgress = sequelize.define("ChapterProgress", {
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
  });

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
