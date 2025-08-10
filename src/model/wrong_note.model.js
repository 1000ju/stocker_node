module.exports = (sequelize, DataTypes) => {
  const WrongNote = sequelize.define(
    "WrongNote",
    {
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
    },
    {
      tableName: "wrong_note", // DB 실제 테이블명(단수)
      timestamps: false,       // createdAt, updatedAt 컬럼 없음
    }
  );

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
