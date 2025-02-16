const express = require('express');
const router = express.Router();
const { loginPage, dashboard, viewTicket, purchaseHistory } = require('../controllers/WebController');
const Ticket = require('../models/Ticket');

// ✅ Página inicial
router.get('/', (req, res) => {
    res.render('home', { title: 'Bem-vindo ao Sistema de Ingressos' });
});

// ✅ Página de login e registro (sem autenticação)
router.get('/login', loginPage);
router.get('/register', (req, res) => res.render('register', { title: 'Cadastro de Usuário' }));

// ✅ Dashboard (com autenticação)
router.get('/dashboard', dashboard);

// ✅ Visualizar ingresso
router.get('/ingresso/:id', viewTicket);

// ✅ Listar ingressos com tratamento de erro detalhado
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        const ticketsPlain = tickets.map(ticket => ticket.get({ plain: true }));

        console.log("🎟️ Ingressos encontrados:", ticketsPlain);
        res.render('tickets', { title: 'Ingressos Disponíveis', tickets: ticketsPlain });
    } catch (error) {
        console.error("❌ Erro ao buscar ingressos:", error);
        res.status(500).render('error', { title: 'Erro', message: 'Erro ao buscar ingressos', details: error.message });
    }
});

// ✅ Página de compra bem-sucedida
router.get('/compra-sucesso', (req, res) => {
    const { ticketName, quantity } = req.query;
    res.render('compraSucesso', { title: 'Compra Realizada', ticketName, quantity });
});

// ✅ Histórico de compras (protegido)
router.get('/purchases/history', purchaseHistory);

module.exports = router;
