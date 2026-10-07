require('dotenv').config({ quiet: true });
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Задайте JWT_SECRET длиной не менее 32 символов');
}
const express = require('express');
const documentRoutes = require('./routes/documents');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const { auth } = require('./middleware/auth');
const { profile } = require('./controllers/authController');

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use('/auth', authRoutes);
app.get('/profile', auth, profile);
app.use('/documents', documentRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isValidationError = error.name === 'SequelizeValidationError';
  const status = error.status === 400 || error.type === 'entity.parse.failed' || isValidationError
    ? 400
    : [401, 403, 404, 409, 413].includes(error.status)
      ? error.status
      : 500;
  const message = status === 400 && error.type === 'entity.parse.failed'
    ? 'Некорректный JSON в теле запроса'
    : isValidationError
      ? error.errors.map((item) => item.message).join('; ')
    : status === 500
      ? 'Внутренняя ошибка сервера'
      : error.message;

  res.status(status).json({ error: message });
});

if (require.main === module) {
  sequelize.authenticate()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error('Не удалось подключиться к PostgreSQL:', error.message);
      process.exitCode = 1;
    });
}

module.exports = app;
