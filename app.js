// Importa módulos necessários
const express = require('express');
const session = require('express-session');
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

// Carrega variáveis de ambiente
dotenv.config();

// Cria uma instância do Express
const app = express();

// Middleware de log de requisições
app.use(morgan('dev'));

// Define a pasta pública para arquivos estáticos
app.use(express.static('public'));

// Configurações de segurança com Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Desativa CSP
  xssFilter: false // Desativa X-XSS-Protection
}));

// Habilita CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(cookieParser());

// Remove cabeçalhos desnecessários
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-XSS-Protection');
  next();
});

// Configuração do Handlebars como motor de visualização
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Configuração de sessão
app.use(session({
  secret: 'seu_segredo_aqui', // Substitua por um segredo seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Limitação de requisições para evitar abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por janela de tempo
  message: 'Muitas requisições feitas. Tente novamente mais tarde.'
});
app.use(limiter);

// Middleware para processar JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para autenticação via token
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

// Rotas do sistema
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/', require('./routes/purchaseRoutes'));

// Rota para página inicial
app.get('/', (req, res) => {
  res.render('home');
});

// Rota para dashboard, requer autenticação
app.get('/dashboard', authenticateToken, (req, res) => {
  res.render('dashboard');
});

// Inicia o servidor na porta definida em variáveis de ambiente ou 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});