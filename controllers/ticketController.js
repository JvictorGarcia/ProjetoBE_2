const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
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

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};