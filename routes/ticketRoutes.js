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

// Rotas de ingressos
router.post('/', authenticateToken, isAdmin, createTicket);
router.get('/', authenticateToken, getAllTickets);
router.get('/:id', authenticateToken, getTicketById);
router.put('/:id', authenticateToken, isAdmin, updateTicket);
router.delete('/:id', authenticateToken, isAdmin, deleteTicket);
router.post('/comprar', authenticateToken, purchaseTicket);
router.post('/comprar-multiplos', authenticateToken, purchaseMultipleTickets);
router.get('/history', authenticateToken, getPurchaseHistory);

module.exports = router;