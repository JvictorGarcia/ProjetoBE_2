const Ticket = require('../models/Ticket');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');

// 🔹 Middleware para validação de dados
const validateTicket = [
  body('name').notEmpty().withMessage('O nome do ingresso é obrigatório.'),
  body('price').isFloat({ min: 0.01 }).withMessage('O preço deve ser maior que 0.01.'),
  body('quantity').isInt({ min: 0 }).withMessage('A quantidade deve ser 0 ou maior.'),
];

// 🔹 Criar ingresso
const createTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, price, quantity } = req.body;
    const ticket = await Ticket.create({ name, price, quantity });
    res.status(201).json(ticket);
  } catch (error) {
    console.error('❌ Erro ao criar ingresso:', error);
    res.status(500).json({ error: 'Erro ao criar ingresso', details: error.message });
  }
};

// 🔹 Atualizar ingresso
const updateTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ingresso não encontrado' });

    await ticket.update(req.body);
    res.json({ message: 'Ingresso atualizado' });
  } catch (error) {
    console.error('❌ Erro ao atualizar ingresso:', error);
    res.status(500).json({ error: 'Erro ao atualizar ingresso', details: error.message });
  }
};

module.exports = { createTicket, updateTicket, validateTicket };
