const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);

module.exports = router;