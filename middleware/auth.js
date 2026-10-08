// Учебная имитация: query-параметр не заменяет настоящую авторизацию.
module.exports = function auth(req, res, next) {
  if (req.query.auth !== '1') {
    return res.redirect('/login');
  }

  req.user = { name: 'Участник команды' };
  next();
};
