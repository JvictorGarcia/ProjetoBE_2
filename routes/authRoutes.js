const express = require('express');
const router = express.Router();
const { register, login, validateUserRegistration } = require('../controllers/userController');
const { body, validationResult } = require('express-validator');

// 🔹 Rota de registro com validação
router.post('/register', validateUserRegistration, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  register(req, res);
});

// 🔹 Rota de login
router.post('/login', [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha obrigatória')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  login(req, res);
});

// 🔹 Rota de logout melhorada
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: "Logout realizado com sucesso." });
});

module.exports = router;
