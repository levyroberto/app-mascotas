import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: 'Token requerido (Authorization: Bearer <token>)' });
    }

    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (error) {
    console.error("Error en auth middleware:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }

    return res.status(401).json({ message: 'Token inválido' });
  }
}
