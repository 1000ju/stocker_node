module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    "Quiz",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_1: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_2: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_3: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_4: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correct_option: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hint: { type: DataTypes.TEXT, allowNull: true 
        
      },
    },
    {
      tableName: "quiz",   // DB 실제 테이블명
      timestamps: false    // createdAt, updatedAt 없으면 false
    }
  );

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Chapter, {
      foreignKey: "chapter_id",
      onDelete: "CASCADE",
    });

    Quiz.hasMany(models.WrongNote, {
      foreignKey: "quiz_id",
      onDelete: "CASCADE",
    });
  };

  return Quiz;
};
