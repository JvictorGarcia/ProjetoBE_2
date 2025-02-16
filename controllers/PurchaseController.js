const { Purchase, Ticket } = require('../models');

// 🔹 Criar uma compra

const createPurchase = async (req, res) => {
  console.log("🛒 createPurchase foi chamado com req.body:", req.body);
  try {
    const { ticketId, quantity } = req.body;
    const userId = req.user.id; // 🔹 Certifique-se de que `req.user` está definido

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ingresso não encontrado.' });

    if (ticket.quantity < quantity) {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque.' });
    }

    const purchase = await Purchase.create({ userId, ticketId, quantity });

    ticket.quantity -= quantity;
    await ticket.save();

    res.status(201).json({ message: 'Compra realizada com sucesso!', purchase });
  } catch (error) {
    console.error('Erro ao processar a compra:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};



// 🔹 Histórico de compras do usuário
const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await Purchase.findAll({
      where: { userId },
      include: [{ model: Ticket, attributes: ['name', 'price'] }]
    });

    res.json({ purchases });
  } catch (error) {
    console.error('❌ Erro ao buscar histórico de compras:', error);
    res.status(500).json({ error: 'Erro ao recuperar histórico de compras.' });
  }
};
console.log('🔍 PurchaseController:', {
  createPurchase: typeof createPurchase,
  getUserPurchases: typeof getUserPurchases
});

exports.createPurchase = createPurchase;
exports.getUserPurchases = getUserPurchases;


