const express = require('express');
const documentRoutes = require('./routes/documents');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/documents', documentRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status === 400 || error.type === 'entity.parse.failed'
    ? 400
    : error.status === 404
      ? 404
      : 500;
  const message = status === 400 && error.type === 'entity.parse.failed'
    ? 'Некорректный JSON в теле запроса'
    : status === 500
      ? 'Внутренняя ошибка сервера'
      : error.message;

  res.status(status).json({ error: message });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
