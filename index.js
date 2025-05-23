const express = require("express");
const { Sequelize } = require("sequelize");
const cors = require("cors");
const dotenv = require("dotenv");
const tareaRoutes = require("./routes/tareaRoutes");
const authRoutes = require("./routes/authRoutes");

// Cargar variables de entorno desde .env
dotenv.config();

const app = require("./app"); 

// Configurar Sequelize con variables de entorno

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Configurar CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use("/tareas", tareaRoutes);
app.use("/auth", authRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API! Usa /usuarios o /tareas para interactuar.");
});

// Conectar a la base de datos
sequelize.authenticate()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar con PostgreSQL:", err));

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
