'use strict';

const { Model } = require('objection');
const path = require('path');

class Account extends Model {
  static get tableName() {
    return 'accounts';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'accountNumber',
      ],
      properties: {
        id: {
          type: 'integer'
        },
        accountNumber: {
          type: 'string',
          minLength: 4,
          maxLength: 32,
          pattern: '^(\\d+-?)+$',
        },
        userId: {
          type: 'integer',
        }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: 'accounts.userId',
          to: 'users.id',
        }
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'transaction'),
        join: {
          from: 'accounts.id',
          to: 'transactions.accountId',
        },
      },
    };
  }

  get balance() {
    return this.transactions.reduce((balance, transaction) => {
      switch (transaction.operation) {
      case 'deposit':
        return balance + transaction.amount;
      case 'withdrawal':
      case 'payment':
        return balance - transaction.amount;
      default:
        throw new Error('Invalid transaction entry', transaction);
      }
    }, 0.0);
  }
}

module.exports = Account;
