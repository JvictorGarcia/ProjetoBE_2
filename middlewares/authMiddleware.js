const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.header('Authorization') || req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]; // Remove "Bearer " do início
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido.' });
    }
};

// Middleware para verificar se o usuário é admin
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem executar esta ação.' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };