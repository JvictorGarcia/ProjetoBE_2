require('dotenv').config();
const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cors = require('cors');
const db = require('./config/database');

const app = express();

// Verifica se a conexão com o banco foi bem-sucedida
db.authenticate()
  .then(() => console.log('📦 Conectado ao banco de dados'))
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco:', err);
    process.exit(1); // Finaliza o servidor se não conectar ao banco
  });

// Configuração do CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Configuração do Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware para JSON e arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importação das rotas
const ticketRoutes = require('./routes/ticket');
const purchaseRoutes = require('./routes/purchaseRoutes');
const pageRoutes = require('./routes/pageRoutes');

// Definição das rotas
app.use('/', pageRoutes);
app.use('/tickets', ticketRoutes);
app.use('/purchases', purchaseRoutes);

// Páginas principais
app.get('/', (req, res) => res.render('home', { title: 'Bem-vindo!' }));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Painel de Controle' }));

// Tratamento de erros globais para evitar falhas inesperadas
process.on('uncaughtException', err => {
  console.error('❌ Erro não tratado:', err);
});

process.on('unhandledRejection', err => {
  console.error('❌ Rejeição não tratada:', err);
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
