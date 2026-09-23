const express = require('express');
const documentsController = require('../controllers/documentsController');

const router = express.Router();

router.get('/', documentsController.getAllDocuments);
router.get('/:id', documentsController.getDocumentById);
router.post('/', documentsController.createDocument);
router.put('/:id', documentsController.updateDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
