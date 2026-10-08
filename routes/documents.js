const router = require('express').Router();
const controller = require('../controllers/documentsController');
const auth = require('../middleware/auth');

router.get('/', controller.index);
router.get('/item/:id', controller.item);
router.get('/add', auth, controller.addForm);
router.post('/add', auth, controller.add);
router.get('/login', (req, res) => res.render('login', { title: 'Учебная авторизация' }));

module.exports = router;
