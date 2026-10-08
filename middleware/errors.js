function notFound(req, res) {
  res.status(404).render('404', { title: 'Страница не найдена' });
}

// Четыре параметра позволяют Express распознать обработчик ошибок.
function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);

  res.status(500).render('500', { title: 'Ошибка сервера' });
}

module.exports = { notFound, errorHandler };
