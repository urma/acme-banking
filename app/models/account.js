module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    accountNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      is: /^\d+(-\d+)+$/,
    },
    balance: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return this.transactions.reduce((balance, transaction) => {
          switch (transaction.operation) {
          case 'deposit':
            return balance + transaction.amount;
          case 'withdrawal':
          case 'payment':
            return balance - transaction.amount;
          default:
          // eslint-disable-next-line no-console
            console.error('Unsupported transaction type found:', transaction.operation);
          }
        }, 0.0);
      },
    },
  });
};
