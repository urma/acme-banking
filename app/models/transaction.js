module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    operation: {
      type: DataTypes.ENUM('deposit', 'withdrawal', 'payment'),
      allowNull: false,
    },
  });
};
