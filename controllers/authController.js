const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function credentials(body) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body?.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof password !== 'string' || !password.length || Buffer.byteLength(password, 'utf8') > 72) {
    const error = new Error('Укажите корректный email и пароль длиной от 1 до 72 байт');
    error.status = 400;
    throw error;
  }
  return { email, password };
}

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

async function register(req, res) {
  const { email, password } = credentials(req.body);
  if (await User.findOne({ where: { email } })) return res.status(409).json({ error: 'Email уже зарегистрирован' });
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, passwordHash, role: 'user' });
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Email уже зарегистрирован' });
    throw error;
  }
}

async function login(req, res) {
  const { email, password } = credentials(req.body);
  const user = await User.findOne({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) return res.status(401).json({ error: 'Неверный email или пароль' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  res.json({ token, tokenType: 'Bearer', expiresIn: 3600 });
}

function profile(req, res) { res.json(publicUser(req.currentUser)); }

module.exports = { register, login, profile };
