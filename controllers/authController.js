const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    console.error("🛑 Error detallado:", error);
    res.status(500).json({
    message: 'Error al registrar usuario',
    error: error.message || 'Error desconocido'
  });
}
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ['id', 'name', 'email'] });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};
