module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define("Tarea", {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Tarea.associate = (models) => {
    Tarea.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Tarea;
};
