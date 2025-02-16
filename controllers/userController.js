const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// 🔹 Middleware de validação
const validateUserRegistration = [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres'),
  body('name').notEmpty().withMessage('O nome é obrigatório')
];

// 🔹 Cadastro de usuário
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Email já cadastrado!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário', details: error.message });
  }
};

// 🔹 Login de usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email ou senha inválidos' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Email ou senha inválidos' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error('❌ Erro ao realizar login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

// 🔹 Exportação correta
module.exports = { register, login, validateUserRegistration };
