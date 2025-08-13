// 함수 export 패턴 (model/index.js에서 자동 로드)
module.exports = (sequelize, DataTypes) => {
  const Memo = sequelize.define(
    "Memo",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      template_type: {
        type: DataTypes.ENUM("일지", "일기", "체크리스트", "자유", "자무지프"),
        allowNull: false,
      },
      content: { type: DataTypes.JSON, allowNull: false },
      // created_at을 최종 수정 시각으로 사용(업데이트 때도 갱신)
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "memos",
      timestamps: false, // created_at 직접 제어
    }
  );

  // 선택: FK 설정(참조 무결성에 도움, 실제 FK는 마이그레이션에서 추가 권장)
  Memo.associate = (models) => {
    Memo.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id",
      onDelete: "CASCADE",
    });
  };

  return Memo;
};
