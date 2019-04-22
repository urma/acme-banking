'use strict';

const { Model } = require('objection');

class Transaction extends Model {
  static get tableName() {
    return 'transactions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'amount', 'operation'
      ],
      properties: {
        id: {
          type: 'integer'
        },
        amount: {
          type: 'number'
        },
        operation: {
          type: 'string',
          pattern: Transaction.transactionTypes.join('|'),
        },
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./account'),
        join: {
          from: 'transactions.accountId',
          to: 'accounts.id',
        }
      },
    };
  }

  static get transactionTypes() {
    return [
      'deposit', 'withdrawal', 'payment'
    ];
  }
}

module.exports = Transaction;
