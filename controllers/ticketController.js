const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');

const createTicket = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const ticket = await Ticket.create({ name, price, quantity });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar ingresso' });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingressos' });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingresso' });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado' });
    }
    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar ingresso' });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado' });
    }
    await ticket.destroy();
    res.json({ message: 'Ingresso deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar ingresso' });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    const successMessage = req.session.successMessage;
    delete req.session.successMessage;
    res.render('tickets', { tickets, successMessage });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingressos' });
  }
};

const purchaseTicket = async (req, res) => {
  const { ticketId, quantity } = req.body;
  try {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket || ticket.quantity < quantity) {
      return res.status(400).json({ error: 'Quantidade solicitada excede o estoque disponível' });
    }
    const purchase = await Purchase.create({ ticketId, quantity, userId: req.user.id, totalPrice: ticket.price * quantity });
    await ticket.update({ quantity: ticket.quantity - quantity });
    req.session.successMessage = 'Ingresso comprado com sucesso';
    res.redirect('/tickets');
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar compra' });
  }
};

const purchaseMultipleTickets = async (req, res) => {
  const tickets = req.body.tickets;
  const userId = req.user.id;

  try {
    for (let i = 0; i < tickets.length; i++) {
      const { ticketId, quantity } = tickets[i];
      if (quantity > 0) {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket || ticket.quantity < quantity) {
          return res.status(400).json({ error: 'Quantidade solicitada excede o estoque disponível' });
        }
        const purchase = await Purchase.create({ ticketId, quantity, userId, totalPrice: ticket.price * quantity });
        await ticket.update({ quantity: ticket.quantity - quantity });
      }
    }
    req.session.successMessage = 'Ingressos comprados com sucesso';
    res.redirect('/tickets');
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar compras' });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Ticket,
        attributes: ['name', 'price', 'createdAt', 'updatedAt']
      }]
    });

    res.render('history', { purchases });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico de compras' });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTickets,
  purchaseTicket,
  purchaseMultipleTickets,
  getPurchaseHistory,
};