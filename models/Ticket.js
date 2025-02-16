const { DataTypes, Model } = require('sequelize');

class Ticket extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.01 },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      }
    }, {
      sequelize, // 🔹 Agora recebe a instância corretamente
      modelName: 'Ticket',
    });
  }
}

module.exports = Ticket;
