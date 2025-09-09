// ✅ 함수형 export (sequelize, DataTypes를 인자로 받음)
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      attendance_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      is_present: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "attendance",
      timestamps: false,
    }
  );

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  };

  return Attendance;
};
