const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');

const createPurchase = async (req, res) => {
  const { ticketId, quantity } = req.body;
  try {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket || ticket.quantity < quantity) {
      return res.status(400).json({ error: 'Quantidade solicitada excede o estoque disponível' });
    }
    const purchase = await Purchase.create({ ticketId, quantity, userId: req.user.id, totalPrice: ticket.price * quantity });
    await ticket.update({ quantity: ticket.quantity - quantity });
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar compra' });
  }
};

const getUserPurchases = async (req, res) => {
  console.log("🚀 Função getUserPurchases foi chamada!");
  
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Ticket,
        attributes: ['name', 'price', 'createdAt', 'updatedAt']
      }]
    });

    res.json(purchases);
  } catch (error) {
    console.log("❌ Erro ao buscar compras do usuário:", error.message);
    res.status(500).json({ error: 'Erro ao buscar compras do usuário' });
  }
};
const getPurchaseHistory = async (req, res) => {
  console.log("🚀 Função getPurchaseHistory foi chamada! Usuário ID:", req.user.id);
  
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Ticket,
        attributes: ['name', 'price', 'createdAt', 'updatedAt']
      }]
    });

    console.log("📊 Compras encontradas:", purchases);

    const ticketsByType = purchases.reduce((acc, purchase) => {
      const ticketType = purchase.Ticket.name;
      if (!acc[ticketType]) {
        acc[ticketType] = [];
      }
      acc[ticketType].push(purchase);
      return acc;
    }, {});

    res.render('history', { ticketsByType });
  } catch (error) {
    console.log("❌ Erro ao buscar histórico de compras:", error.message);
    res.status(500).json({ error: 'Erro ao buscar histórico de compras' });
  }
};


module.exports = {
  createPurchase,
  getUserPurchases, 
  getPurchaseHistory,
};
