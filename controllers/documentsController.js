const documentModel = require('../models/documentModel');

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateDocumentBody(body) {
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    return 'Поле title обязательно и должно быть непустой строкой';
  }

  if (typeof body.content !== 'string' || !body.content.trim()) {
    return 'Поле content обязательно и должно быть непустой строкой';
  }

  return null;
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
  const validationError = validateDocumentBody(body);
  if (validationError) {
    throw createError(validationError, 400);
  }
}

function getAllDocuments(req, res) {
  res.json(documentModel.getAllDocuments());
}

function getDocumentById(req, res) {
  const id = validateId(req.params.id);
  const document = documentModel.findDocumentById(id);
  if (!document) {
    throw createError('Документ не найден', 404);
  }
  res.json(document);
}

function createDocument(req, res) {
  validateBody(req.body);
  const document = documentModel.createDocument({
    title: req.body.title.trim(),
    content: req.body.content,
  });
  res.status(201).json(document);
}

function updateDocument(req, res) {
  const id = validateId(req.params.id);
  validateBody(req.body);
  const document = documentModel.updateDocument(id, {
    title: req.body.title.trim(),
    content: req.body.content,
  });
  if (!document) {
    throw createError('Документ не найден', 404);
  }
  res.json(document);
}

function deleteDocument(req, res) {
  const id = validateId(req.params.id);
  if (!documentModel.deleteDocument(id)) {
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
