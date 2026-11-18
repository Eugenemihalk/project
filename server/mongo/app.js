const express = require('express');
const mongoose = require('mongoose');
const Document = require('./Document');
const app = express();
app.use(express.json({ limit: '1mb' }));
const router = express.Router();
const fail = (message, status = 400) => Object.assign(new Error(message), { status });
router.param('id', (req, res, next, id) => {
  if (!/^[a-f\d]{24}$/i.test(id)) return next(fail('Некорректный ObjectId'));
  next();
});
const found = doc => { if (!doc) throw fail('Документ или комментарий не найден', 404); return doc; };
function fields(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object') throw fail('Ожидается JSON объект');
  const allowed = ['title', 'content', 'status', 'tags', 'participants'];
  if (Object.keys(body).some(key => !allowed.includes(key))) throw fail('Неизвестное поле');
  return Object.fromEntries(allowed.filter(key => body[key] !== undefined).map(key => [key, body[key]]));
}
router.get('/', async (req, res) => {
  const filter = {};
  if (typeof req.query.tag === 'string') filter.tags = req.query.tag;
  if (typeof req.query.email === 'string') filter['participants.email'] = req.query.email.toLowerCase();
  res.json(await Document.find(filter).sort({ createdAt: -1 }).limit(100));
});
router.get('/:id', async (req, res) => res.json(found(await Document.findById(req.params.id))));
router.post('/', async (req, res) => res.status(201).json(await Document.create(fields(req.body))));
router.put('/:id', async (req, res) => {
  const data = fields(req.body);
  if (typeof data.title !== 'string' || !data.title.trim() || typeof data.content !== 'string' || !data.content.trim()) throw fail('title и content обязательны');
  res.json(found(await Document.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true })));
});
router.delete('/:id', async (req, res) => res.json(found(await Document.findByIdAndDelete(req.params.id))));
router.post('/:id/comments', async (req, res) => {
  const { author, text } = req.body || {};
  if (typeof author !== 'string' || !author.trim() || typeof text !== 'string' || !text.trim()) throw fail('author и text обязательны');
  res.status(201).json(found(await Document.findByIdAndUpdate(req.params.id, { $push: { comments: { author, text } } }, { new: true, runValidators: true })));
});
router.patch('/:id/comments/:commentId', async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.commentId) || typeof req.body?.resolved !== 'boolean') throw fail('Укажите ObjectId комментария и boolean resolved');
  res.json(found(await Document.findOneAndUpdate({ _id: req.params.id, 'comments._id': req.params.commentId }, { $set: { 'comments.$.resolved': req.body.resolved } }, { new: true, runValidators: true })));
});
app.use('/documents', router);
app.use((req, res) => res.status(404).json({ error: 'Маршрут не найден' }));
app.use((err, req, res, next) => {
  const status = err.status || (['ValidationError', 'CastError'].includes(err.name) || err.type === 'entity.parse.failed' ? 400 : 500);
  res.status(status).json({ error: status === 500 ? 'Ошибка сервера' : err.message });
});
module.exports = app;
