module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define("Chapter", {
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
  });

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
