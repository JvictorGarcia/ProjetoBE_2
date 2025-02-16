const { createPurchase, getUserPurchases } = require('../controllers/PurchaseController');




const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');


console.log("🔍 Tipo de createPurchase:", typeof createPurchase);
console.log("🔍 Conteúdo completo de createPurchase:", createPurchase);

// 🔹 Middleware para validar a compra
const validatePurchase = [
  body('ticketId').isUUID().withMessage('ID do ingresso inválido.'),
  body('quantity').isInt({ min: 1 }).withMessage('A quantidade deve ser pelo menos 1.')
];

// 🔹 Criar compra com validação
router.post('/purchase', authMiddleware, validatePurchase, createPurchase);
router.get('/history', authMiddleware, getUserPurchases);



module.exports = router;
