const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de importar corretamente

const db = {};

// 🔹 Importando modelos, mas sem inicializá-los ainda
db.User = require('./User');
db.Ticket = require('./Ticket');
db.Purchase = require('./Purchase');

// 🔹 Inicializando modelos corretamente
Object.values(db).forEach(model => {
  if (typeof model.init === 'function') {
    model.init(sequelize);
  }
});

// 🔹 Definindo associações, se houver
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

// 🔹 Adicionando instância do Sequelize ao objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
