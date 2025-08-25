module.exports = (sequelize, DataTypes) => {
  const InvestmentProfile = sequelize.define(
    "InvestmentProfile",
    {
      profile_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      // MBIT형 4글자 코드: (E/C)(S/L)(A/P)(I/D)
      type_code: { type: DataTypes.STRING(100), allowNull: false },
      // 추천 거장 목록(JSON 문자열) 캐시
      matched_master: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "investment_profile",
      timestamps: false,
      underscored: true,
    }
  );

  InvestmentProfile.associate = (models) => {
    InvestmentProfile.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return InvestmentProfile;
};
