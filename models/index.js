'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};

// Configurar la conexión a la base de datos usando variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME || 'gestortareas',    // Nombre de la base de datos
  process.env.DB_USER || 'postgres',       // Usuario de la base de datos
  process.env.DB_PASSWORD || '12345678',  // Contraseña de la base de datos
  {
    host: process.env.DB_HOST || '127.0.0.1',  // Dirección del host (puedes usar 'localhost' o la IP)
    dialect: 'postgres',                      // Dialecto de la base de datos (PostgreSQL)
    logging: false,                           // Desactiva el logging de SQL en consola (opcional)
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
  }
);

// Leer los archivos de modelos y cargarlos
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Asociar los modelos (si es necesario)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
