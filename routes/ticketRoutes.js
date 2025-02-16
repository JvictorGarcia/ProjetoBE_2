const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, getTickets, purchaseTicket, purchaseMultipleTickets, getPurchaseHistory } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createTicket);
router.get('/all', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);
router.get('/', authenticateToken, getTickets);
router.post('/comprar', authenticateToken, purchaseTicket);
router.post('/comprar-multiplos', authenticateToken, purchaseMultipleTickets);
router.get('/history', authenticateToken, getPurchaseHistory);

module.exports = router;