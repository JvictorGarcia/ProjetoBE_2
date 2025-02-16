const jwt = require('jsonwebtoken');

const isTokenRevoked = (token) => {
  // Implemente a lógica para verificar se o token foi revogado
  return false; // Retorne true se o token foi revogado
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

const isAdmin = (req, res, next) => {
  if (req.user && req.user.login === 'admin@admin' && req.user.password === 'admin1234') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
};