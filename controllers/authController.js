import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario/usuarioSchema.js';
import bcryptjs from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password requeridos' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const ok = await bcryptjs.compare(password, usuario.password);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({ message: 'Login exitoso', token });

  } catch (error) {
    res.status(500).json({ message: 'Error en login', error: error.message });
  }
};
