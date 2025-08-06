// src/model/user.model.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      nickname: { type: DataTypes.STRING },
      profile_image_url: { type: DataTypes.STRING },
      provider: { type: DataTypes.STRING },
      age: { type: DataTypes.INTEGER },
      occupation: { type: DataTypes.STRING },
      access_token: { type: DataTypes.STRING },
      refresh_token: { type: DataTypes.STRING },
      created_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "user",
      timestamps: false,
    }
  );
  return User;
};
