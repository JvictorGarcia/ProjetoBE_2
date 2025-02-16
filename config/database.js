const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
});

module.exports = sequelize;

// Função para tentar conectar com reconexão automática
const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync(); // Melhor usar migrações ao invés de alter:true
        console.log('📌 Modelos sincronizados.');
      }
      return;
    } catch (error) {
      console.error(`❌ Erro ao conectar ao banco (${6 - retries}ª tentativa):`, error);
      retries -= 1;
      if (!retries) process.exit(1); // Sai do processo após 5 tentativas
      await new Promise(res => setTimeout(res, 5000)); // Espera 5s antes da próxima tentativa
    }
  }
};

// Inicia a conexão
connectDB();