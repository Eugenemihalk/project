let nextId = 2;

const documents = [
  {
    id: 1,
    title: 'Добро пожаловать',
    content: 'Это первый документ для совместного редактирования.',
    createdAt: '2026-09-23T00:00:00.000Z',
    updatedAt: '2026-09-23T00:00:00.000Z',
  },
];

function getAllDocuments() {
  return documents;
}

function findDocumentById(id) {
  return documents.find((document) => document.id === id);
}

function createDocument({ title, content }) {
  const now = new Date().toISOString();
  const document = {
    id: nextId++,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };

  documents.push(document);
  return document;
}

function updateDocument(id, { title, content }) {
  const document = findDocumentById(id);
  if (!document) {
    return null;
  }

  document.title = title;
  document.content = content;
  document.updatedAt = new Date().toISOString();
  return document;
}

function deleteDocument(id) {
  const index = documents.findIndex((document) => document.id === id);
  if (index === -1) {
    return false;
  }

  documents.splice(index, 1);
  return true;
}

module.exports = {
  getAllDocuments,
  findDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
