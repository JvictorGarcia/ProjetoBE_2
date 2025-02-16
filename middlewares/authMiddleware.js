const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isTokenRevoked = (token) => {
  return false;
};

const authenticateToken = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    token = req.cookies.token;
  } else if (token.startsWith("Bearer ")) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  if (isTokenRevoked(token)) {
    return res.status(403).json({ error: 'Token revogado.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

const isAdmin = async (req, res, next) => {
  try {

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar o usuário.' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
};