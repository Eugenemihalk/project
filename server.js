const express = require('express');
const documentRoutes = require('./routes/documents');
const { sequelize } = require('./models');

const app = express();
const port = 7000;

app.use(express.json());
app.use('/documents', documentRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isValidationError = error.name === 'SequelizeValidationError';
  const status = error.status === 400 || error.type === 'entity.parse.failed' || isValidationError
    ? 400
    : error.status === 404
      ? 404
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
