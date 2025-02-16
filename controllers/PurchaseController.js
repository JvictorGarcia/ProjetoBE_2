const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');

const createPurchase = async (req, res) => {
  const { ticketId, quantity } = req.body;
  try {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket || ticket.quantity < quantity) {
      return res.status(400).json({ error: 'Quantidade solicitada excede o estoque disponível' });
    }
    const purchase = await Purchase.create({ ticketId, quantity, userId: req.user.id });
    await ticket.update({ quantity: ticket.quantity - quantity });
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar compra' });
  }
};

const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({ where: { userId: req.user.id } });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico de compras' });
  }
};

module.exports = {
  createPurchase,
  getUserPurchases,
};