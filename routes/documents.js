const express = require('express');
const documentsController = require('../controllers/documentsController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', documentsController.getAllDocuments);
router.get('/:id', documentsController.getDocumentById);
router.post('/', documentsController.createDocument);
router.put('/:id', documentsController.updateDocument);
router.delete('/:id', isAdmin, documentsController.deleteDocument);

module.exports = router;
