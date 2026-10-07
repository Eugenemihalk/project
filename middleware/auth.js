const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function auth(req, res, next) {
  const match = /^Bearer ([^\s]+)$/i.exec(req.get('Authorization') || '');
  if (!match) return res.status(401).json({ error: 'Требуется токен Authorization: Bearer <token>' });
  let decoded;
  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!Number.isInteger(decoded.id) || decoded.id <= 0 || !decoded.exp) throw new Error('Invalid claims');
  } catch {
    return res.status(401).json({ error: 'Недействительный или истёкший токен' });
  }
  const user = await User.findByPk(decoded.id, { attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'] });
  if (!user) return res.status(401).json({ error: 'Пользователь не найден' });
  req.user = decoded;
  req.currentUser = user;
  next();
}

function isAdmin(req, res, next) {
  if (req.currentUser?.role !== 'admin') return res.status(403).json({ error: 'Доступ разрешён только администратору' });
  next();
}

module.exports = { auth, isAdmin };
