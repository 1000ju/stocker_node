module.exports = (sequelize, DataTypes) => {
  const InvestmentMaster = sequelize.define(
    "InvestmentMaster",
    {
      master_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      bio: { type: DataTypes.TEXT, allowNull: true }, // 1소개글
      portfolio_summary: { type: DataTypes.TEXT, allowNull: true },
      image_url: { type: DataTypes.STRING(255), allowNull: true },
      style: { type: DataTypes.STRING(100), allowNull: true }, // 사람이 읽는 스타일 설명
      type_code: { type: DataTypes.STRING(4), allowNull: false }, // "CLPD" 같은 MBIT 코드
    },
    {
      tableName: "investment_master",
      timestamps: false,
      underscored: true,
    }
  );

  return InvestmentMaster;
};
