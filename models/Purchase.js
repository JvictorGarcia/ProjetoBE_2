const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Ticket = require('./Ticket');

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticketId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Ticket, 
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Purchase.belongsTo(Ticket, { foreignKey: 'ticketId' });

module.exports = Purchase;
