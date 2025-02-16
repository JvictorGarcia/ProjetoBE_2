const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');

const loginPage = (req, res) => {
  res.render('login');
};

const purchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await Purchase.findAll({
      where: { userId },
      include: { model: Ticket }
    });

    res.render('historico', { title: 'Histórico de Compras', purchases });
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    res.status(500).json({ error: 'Erro ao carregar histórico de compras' });
  }
};

const viewTicket = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) {
    return res.status(404).send('Ingresso não encontrado');
  }
  res.render('ingresso', { ticket });
};

const dashboard = (req, res) => {
  res.render('dashboard', { title: 'Painel do Usuário' });
};

const listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.render('tickets', { title: 'Comprar Ingressos', tickets });
  } catch (error) {
    console.error("❌ Erro ao buscar ingressos:", error);
    res.status(500).send('Erro ao buscar ingressos.');
  }
};

// 🔹 Exporte corretamente as funções
module.exports = {
  loginPage,
  dashboard,
  viewTicket,
  purchaseHistory,
  listTickets
};
