const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// 🔍 Teste para ver se a função está correta antes de registrar a rota
console.log("✅ getTickets é uma função?", typeof ticketController.getTickets === 'function');

// Rota para listar todos os ingressos
router.get('/', (req, res) => ticketController.getTickets(req, res)); // 🔄 Alteração aqui

// Rota para visualizar um ingresso específico
router.get('/:id', (req, res) => ticketController.getTicketById(req, res)); // 🔄 Alteração aqui

// Rotas protegidas para administradores
router.post('/', authMiddleware, adminMiddleware, (req, res) => ticketController.createTicket(req, res));
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => ticketController.updateTicket(req, res));
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => ticketController.deleteTicket(req, res));

module.exports = router;
