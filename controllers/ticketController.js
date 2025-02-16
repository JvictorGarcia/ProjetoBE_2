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
    res.render('tickets', { tickets });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingressos' });
  }
};

const purchaseTicket = async (req, res) => {
  const { ticketId, quantity } = req.body;
  try {
    console.log('Iniciando a compra do ingresso');
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket || ticket.quantity < quantity) {
      console.log('Quantidade solicitada excede o estoque disponível');
      return res.status(400).json({ error: 'Quantidade solicitada excede o estoque disponível' });
    }
    console.log('Criando a compra');
    const purchase = await Purchase.create({ ticketId, quantity, userId: req.user.id, totalPrice: ticket.price * quantity });
    console.log('Atualizando a quantidade de ingressos');
    await ticket.update({ quantity: ticket.quantity - quantity });
    console.log('Compra realizada com sucesso');
    res.redirect('/history');
  } catch (error) {
    console.error('Erro ao realizar compra:', error);
    res.status(500).json({ error: 'Erro ao realizar compra' });
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
};