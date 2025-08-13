// 📁 src/model/wrong_note.model.js
module.exports = (sequelize, DataTypes) => {
  const WrongNote = sequelize.define(
    "WrongNote",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      quiz_id: { type: DataTypes.INTEGER, allowNull: false },
      chapter_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      selected_option: { type: DataTypes.TINYINT, allowNull: true }, // ✅ 추가
      created_date: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "wrong_note", timestamps: false }
  );

  WrongNote.associate = (models) => {
    WrongNote.belongsTo(models.Quiz, {
      foreignKey: "quiz_id",
      onDelete: "CASCADE",
    });
  };

  return WrongNote;
};
