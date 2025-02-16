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

// Rotas de ingressos
router.post('/', authenticateToken, isAdmin, createTicket);
router.get('/', authenticateToken, getAllTickets);
router.get('/:id', authenticateToken, getTicketById);
router.put('/:id', authenticateToken, isAdmin, updateTicket);
router.delete('/:id', authenticateToken, isAdmin, deleteTicket);
router.post('/comprar', authenticateToken, purchaseTicket);
router.post('/comprar-multiplos', authenticateToken, purchaseMultipleTickets);
router.get('/history', authenticateToken, getPurchaseHistory);
router.get('/create', authenticateToken, isAdmin, (req, res) => {
    res.render('createTicket');
});



// Rota para exibir a página de gerenciamento de ingressos
router.get('/manage', authenticateToken, isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.findAll(); // Buscar todos os ingressos
        res.render('manageTickets', { tickets });
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar ingressos." });
    }
});


// Rota para criar um novo ingresso
router.post('/create', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        await Ticket.create({ name, price, quantity });

        res.redirect('/tickets/manage'); // Redireciona para a página de gerenciamento após criar
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar ingresso." });
    }
});
// Rota para exibir a página de edição de ingressos
router.get('/edit/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado." });

        res.render('editTicket', { ticket });
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar ingresso." });
    }
});

// Rota para salvar as alterações
router.post('/edit/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const ticket = await Ticket.findByPk(req.params.id);

        if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado." });

        await ticket.update({ name, price, quantity });
        res.redirect('/tickets/manage'); // Volta para a página de gerenciamento
    } catch (error) {
        res.status(500).json({ error: "Erro ao editar ingresso." });
    }
});

// Rota para deletar ingressos
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


module.exports = router;