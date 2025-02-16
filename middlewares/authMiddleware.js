const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;