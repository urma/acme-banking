const bcrypt = require('bcrypt-nodejs');
const { Model } = require('objection');
const path = require('path');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'username', 'email', 'enabled'
      ],
      properties: {
        id: {
          type: 'integer'
        },
        username: {
          type: 'string',
          minLength: 4,
          maxLength: 64,
          pattern: '^[0-9a-z]+$',
        },
        email: {
          type: 'string',
          minLength: 8,
          maxLength: 128,
          format: 'email',
        },
        passwordHash: {
          type: 'string',
          pattern: '^[0-9a-zA-Z\\$]+$',
        },
        enabled: {
          type: 'boolean'
        },
      }
    };
  }

  static get virtualAttributes() {
    return [ 'password' ];
  }

  static get relationMappings() {
    return {
      accounts: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'account'),
        join: {
          from: 'users.id',
          to: 'accounts.userId',
        }
      }
    };
  }

  // eslint-disable-next-line no-unused-vars
  async $beforeUpdate(opt, _queryContext) {
    if (opt.password) {
      this.password = opt.password;
    }
  }

  // eslint-disable-next-line no-unused-vars
  async $beforeInsert(opt, _queryContext) {
    if (opt.password) {
      this.password = opt.password;
    }
  }

  set password(val) {
    this.passwordHash = bcrypt.hashSync(val);
  }

  authenticate(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}

module.exports = User;
