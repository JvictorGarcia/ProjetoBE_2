const express = require('express');
const router = express.Router();
const { createPurchase, getUserPurchases } = require('../controllers/PurchaseController');
const { getPurchaseHistory, purchaseMultipleTickets } = require('../controllers/ticketController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

// Middleware para validar a compra
const validatePurchase = [
  body('ticketId').isUUID().withMessage('ID do ingresso inválido.'),
  body('quantity').isInt({ min: 1 }).withMessage('A quantidade deve ser pelo menos 1.')
];

// Criar compra com validação
router.post('/purchase', authenticateToken, validatePurchase, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  await createPurchase(req, res);
});

// Comprar múltiplos tickets
router.post('/comprar-multiplos', authenticateToken, async (req, res) => {
  await purchaseMultipleTickets(req, res);
});

// Rota para obter compras do usuário
router.get('/history', authenticateToken, getPurchaseHistory);

router.get('/compras', authenticateToken, (req, res) => {
  res.redirect('/history');
});


module.exports = router;