const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const TicketController = require('../controller/TicketController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas (não precisam de autenticação)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas privadas (apenas usuários autenticados)
router.get('/tickets', TicketController.list);
router.post('/tickets', TicketController.create);
router.post('/purchase', TicketController.purchase);

module.exports = router;
