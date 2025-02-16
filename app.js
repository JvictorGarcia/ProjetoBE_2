const express = require('express');
const sequelize = require('./config/database'); 
const User = require('./models/User'); 
const Ticket = require('./models/Ticket'); 
const userRoutes = require('./routes/user'); 
const ticketRoutes = require('./routes/ticket'); 
const { engine } = require('express-handlebars'); 
const helmet = require('helmet'); 
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express(); // ✅ Agora 'app' é inicializado antes de ser usado!

app.use(express.static('public'));

// 🔹 Configuração de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], 
    },
  },
}));

app.use(cors()); 
app.use(cookieParser());

// 🔹 Configuração do Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// 🔹 Limitação de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Muitas requisições feitas. Tente novamente mais tarde.'
});
app.use(limiter);

// 🔹 Middleware para processar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Middleware para autenticação via token
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

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token inválido.' });
    }
};

// 🚀 Rotas do sistema
const webRoutes = require('./routes/webRoutes'); // ✅ Agora a importação acontece depois da inicialização do app!
const purchaseRoutes = require('./routes/purchaseRoutes');

app.use('/', webRoutes);
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

app.use('/', purchaseRoutes);

// 🚀 Iniciar o servidor
const start = async () => {
    try {
        await sequelize.sync({ alter: true }); 
        console.log('✅ Banco de dados sincronizado');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    }
};

start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
