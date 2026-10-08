const express = require('express');
const path = require('node:path');
const documentRoutes = require('./routes/documents');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
const port = process.env.PORT || 7000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Порядок важен: логирование → разбор формы → маршруты → ошибки.
app.use(logger);
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(documentRoutes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

module.exports = app;
