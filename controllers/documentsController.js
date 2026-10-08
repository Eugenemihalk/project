const documents = require('../data/documents');

function index(req, res) {
  res.render('index', { title: 'Документы команды', documents });
}

function item(req, res, next) {
  const document = documents.find((entry) => String(entry.id) === req.params.id);
  if (!document) return next();

  res.render('item', { title: document.title, document });
}

function addForm(req, res) {
  res.render('add', { title: 'Добавить документ', user: req.user, error: null, values: {} });
}

function add(req, res) {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  if (!title || !content) {
    return res.status(400).render('add', {
      title: 'Добавить документ', user: req.user,
      error: 'Заполните название и содержимое документа.', values: { title, content },
    });
  }

  const id = documents.reduce((max, document) => Math.max(max, document.id), 0) + 1;
  documents.push({ id, title, content });
  res.redirect('/');
}

module.exports = { index, item, addForm, add };
