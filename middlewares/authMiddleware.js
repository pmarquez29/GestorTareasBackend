const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Espera formato: "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token malformado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = verifyToken;
