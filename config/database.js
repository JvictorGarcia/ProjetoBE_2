const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt'); // 🔹 Importar bcrypt para criptografar senhas
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
});

module.exports = sequelize;

// Agora importamos os modelos depois de exportar o sequelize
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');

const initDb = async () => {
  try {
    console.log("🔄 Sincronizando banco de dados...");

    // 🔹 Atualiza a estrutura das tabelas sem excluir os dados existentes
    await sequelize.sync({ alter: true });

    console.log('✅ Banco de dados sincronizado com sucesso.');

    // 🔹 Criar usuário administrador apenas se ele ainda não existir
    const adminExists = await User.findOne({ where: { email: 'admin@admin.com' } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin1234', 10);

      await User.create({
        name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin',
      });

      console.log('👤 Usuário administrador criado com sucesso.');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar o banco de dados:', error);
  }
};

// Conectar ao banco
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    await initDb();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  }
};

connectDB();
