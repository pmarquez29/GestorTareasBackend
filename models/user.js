module.exports = (sequelize, DataTypes) => {
  const User =sequelize.define("User", {
    // Definición de los atributos del modelo
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
  User.associate = (models) =>{
    User.hasMany(models.Tarea, { foreignKey: 'userId' });
  };
  return User;
};