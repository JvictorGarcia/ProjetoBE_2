const express = require('express');
const { register, login, validateUserRegistration } = require('../controllers/userController');

const router = express.Router();

// Cadastro de usuário com validação
router.post('/register', validateUserRegistration, register);

// Login de usuário
router.post('/login', login);

module.exports = router;
