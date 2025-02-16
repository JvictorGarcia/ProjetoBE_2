const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getAllTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket, 
  getTickets, 
  purchaseTicket, 
  purchaseMultipleTickets, 
  getPurchaseHistory 
} = require('../controllers/ticketController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const Ticket = require('../models/Ticket');

// ✅ 🔹 Rota para exibir a página de criação de ingressos 
router.get('/create', authenticateToken, isAdmin, (req, res) => {
    res.render('createTicket');
});

// ✅ 🔹 Rota para gerenciar ingressos (Admin)
router.get('/manage', authenticateToken, isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.render('manageTickets', { tickets });
    } catch (error) {
        console.error("❌ Erro ao carregar ingressos:", error);
        res.status(500).json({ error: "Erro ao carregar ingressos." });
    }
});

// ✅ 🔹 Rota para exibir os ingressos disponíveis (Usuários comuns)
router.get('/buy', authenticateToken, async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.render('tickets', { tickets });
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar ingressos." });
    }
});

// ✅ 🔹 Criar um novo ingresso (POST)
router.post('/create', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        await Ticket.create({ name, price, quantity });

        res.redirect('/tickets/manage'); 
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar ingresso." });
    }
});

// ✅ 🔹 Editar um ingresso (GET para exibir formulário)
router.get('/edit/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) {
            console.error("❌ Ingresso não encontrado para edição:", req.params.id);
            return res.status(404).json({ error: "Ingresso não encontrado." });
        }
        res.render('editTicket', { ticket });
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar ingresso." });
    }
});

// ✅ 🔹 Editar um ingresso (POST para salvar alterações)
router.post('/edit/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const ticket = await Ticket.findByPk(req.params.id);

        if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado." });

        await ticket.update({ name, price, quantity });
        res.redirect('/tickets/manage');
    } catch (error) {
        res.status(500).json({ error: "Erro ao editar ingresso." });
    }
});

// ✅ 🔹 Deletar ingresso
router.delete('/delete/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado." });

        await ticket.destroy();
        res.status(200).json({ message: "Ingresso deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar ingresso." });
    }
});

// ✅ 🔹 Buscar ingressos para usuários comuns
router.get('/', authenticateToken, getTickets);

// ✅ 🔹 Comprar múltiplos ingressos
router.post('/comprar-multiplos', authenticateToken, purchaseMultipleTickets);

// ✅ 🔹 Buscar um ingresso específico por ID (DEVE SER A ÚLTIMA ROTA PARA EVITAR CONFLITO!)
router.get('/:id', authenticateToken, getTicketById);

module.exports = router;