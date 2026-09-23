const { Document } = require('../models');

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getDocumentId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateId(value) {
  const id = getDocumentId(value);
  if (id === null) {
    throw createError('ID документа должен быть положительным целым числом', 400);
  }
  return id;
}

function validateBody(body) {
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError('Поле title обязательно и должно быть непустой строкой', 400);
  }

  if (typeof body.content !== 'string' || !body.content.trim()) {
    throw createError('Поле content обязательно и должно быть непустой строкой', 400);
  }
}

function getDocumentData(body) {
  const data = {
    title: body.title.trim(),
    content: body.content,
  };

  if (body.status !== undefined) {
    data.status = body.status;
  }

  return data;
}

async function getAllDocuments(req, res) {
  const documents = await Document.findAll({ order: [['id', 'ASC']] });
  res.json(documents);
}

async function getDocumentById(req, res) {
  const id = validateId(req.params.id);
  const document = await Document.findByPk(id);
  if (!document) {
    throw createError('Документ не найден', 404);
  }
  res.json(document);
}

async function createDocument(req, res) {
  validateBody(req.body);
  const document = await Document.create(getDocumentData(req.body));
  res.status(201).json(document);
}

async function updateDocument(req, res) {
  const id = validateId(req.params.id);
  validateBody(req.body);

  const [updatedCount] = await Document.update(getDocumentData(req.body), {
    where: { id },
  });
  if (updatedCount === 0) {
    throw createError('Документ не найден', 404);
  }

  const document = await Document.findByPk(id);
  res.json(document);
}

async function deleteDocument(req, res) {
  const id = validateId(req.params.id);
  const deletedCount = await Document.destroy({ where: { id } });
  if (deletedCount === 0) {
    throw createError('Документ не найден', 404);
  }
  res.status(204).send();
}

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
