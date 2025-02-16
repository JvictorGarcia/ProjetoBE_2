const express = require('express');
const sequelize = require('./config/database');
const { engine } = require('express-handlebars');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

// Configuração de segurança aprimorada
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    },
  },
}));

app.use(cors());
app.use(cookieParser());

// Configuração do Handlebars
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Limitação de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições feitas. Tente novamente mais tarde.'
});
app.use(limiter);

// Middleware para processar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para autenticação via token
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

// Rotas do sistema
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/purchases', purchaseRoutes);

// Rota para página inicial
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/dashboard', authenticateToken, (req, res) => {
  res.render('dashboard');
});

app.get('/history', authenticateToken, (req, res) => {
  // Aqui você vai buscar e passar as compras do usuário logado
  const purchases = []; // Substitua pelo código para buscar as compras do usuário
  res.render('history', { purchases });
});

// Middleware global de tratamento de erros
app.use(errorHandler);

// Iniciar o servidor
const start = async () => {
  try {
    await sequelize.sync(); // Usar migrações ao invés de sync({ alter: true })
    console.log('✅ Banco de dados sincronizado');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  }
};

start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));