const app = require('./app');
const sequelize = require('./models');
const User = require('./models/user');

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos sincronizada');
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}).catch(err => {
  console.error('Error conectando a la base de datos:', err);
});
