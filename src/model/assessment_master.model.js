// 단일 마스터 테이블: 검사지 + 차원 + 문항
module.exports = (sequelize, DataTypes) => {
  const AssessmentMaster = sequelize.define(
    "AssessmentMaster",
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      version: { type: DataTypes.STRING(20), allowNull: false }, // 'v1.1'
      dimension_code: { type: DataTypes.STRING(1), allowNull: false }, // 'A' | 'B' | 'C' | 'D'
      dimension_name: { type: DataTypes.STRING(50), allowNull: false }, // '리스크 수용성' 등
      left_label: { type: DataTypes.STRING(2), allowNull: false }, // 'E','S','A','I'
      right_label: { type: DataTypes.STRING(2), allowNull: false }, // 'C','L','P','D'
      left_desc: { type: DataTypes.STRING(50), allowNull: false },
      right_desc: { type: DataTypes.STRING(50), allowNull: false },
      global_no: { type: DataTypes.INTEGER, allowNull: false }, // 1..12
      dim_no: { type: DataTypes.INTEGER, allowNull: false }, // 1..3
      question_text: { type: DataTypes.STRING(500), allowNull: false },
      is_reverse: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      note: { type: DataTypes.STRING(100) },
    },
    {
      tableName: "test_master",
      timestamps: false,
      indexes: [
        { fields: ["version"] },
        { unique: true, fields: ["version", "global_no"] },
        { unique: true, fields: ["version", "dimension_code", "dim_no"] },
      ],
    }
  );
  return AssessmentMaster;
};
