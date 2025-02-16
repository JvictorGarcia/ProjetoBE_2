const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, getTickets, purchaseTicket, purchaseMultipleTickets, getPurchaseHistory } = require('../controllers/ticketController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, createTicket);
router.get('/all', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id', authenticateToken, updateTicket);
router.delete('/:id', authenticateToken, deleteTicket);
router.get('/', authenticateToken, getTickets);
router.post('/comprar', authenticateToken, purchaseTicket);
router.post('/comprar-multiplos', authenticateToken, purchaseMultipleTickets);
router.get('/history', authenticateToken, getPurchaseHistory);

module.exports = router;