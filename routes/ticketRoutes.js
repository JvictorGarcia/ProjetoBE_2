const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, getTickets, purchaseTicket } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createTicket);
router.get('/all', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);
router.get('/', authenticateToken, getTickets);
router.post('/comprar', authenticateToken, purchaseTicket);

module.exports = router;