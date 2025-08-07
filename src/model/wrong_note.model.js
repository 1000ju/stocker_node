module.exports = (sequelize, DataTypes) => {
  const WrongNote = sequelize.define("WrongNote", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  WrongNote.associate = (models) => {
    WrongNote.belongsTo(models.Quiz, {
      foreignKey: "quiz_id",
      onDelete: "CASCADE",
    });

    WrongNote.belongsTo(models.Chapter, {
      foreignKey: "chapter_id",
      onDelete: "CASCADE",
    });

    WrongNote.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return WrongNote;
};
