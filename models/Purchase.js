const { DataTypes, Model } = require('sequelize');

class Purchase extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      ticketId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize, // 🔹 Agora recebe a instância corretamente
      modelName: 'Purchase',
    });
  }
}

module.exports = Purchase;
