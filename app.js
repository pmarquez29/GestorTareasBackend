const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tareaRoutes = require('./routes/tareaRoutes'); 
const verifyToken = require('./middlewares/authMiddleware'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/tareas', verifyToken, tareaRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
