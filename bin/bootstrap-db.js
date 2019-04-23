/* eslint no-console: 0 */
'use strict';

const _ = require('lodash');
const getopt = require('node-getopt');
const moment = require('moment');
const path = require('path');
const util = require('util');

// eslint-disable-next-line security/detect-non-literal-require
const models = require(path.resolve(__dirname, '../app/models'));

const args = getopt.create([
  [ 'u', 'username=ARG', 'Username for initial user for application' ],
  [ 'e', 'email=ARG',    'Email for initial user for application' ],
  [ 'p', 'password=ARG', 'Password for initial user for application' ],
]).bindHelp().parseSystem();

if (!args.options.username || !args.options.email || !args.options.password) {
  args.showHelp();
  process.exit(1);
}

models.User.query().insert({
  username: args.options.username,
  email: args.options.email,
  password: args.options.password,
  enabled: true,
}).then(user => {
  console.log(user);

  for (let accountIndex = 0; accountIndex < _.random(3, 6); accountIndex++) {
    user.$relatedQuery('accounts').insert({
      accountNumber: util.format('%i-%i', _.random(0, 9999), _.random(0, 999999)),
    }).then(account => {
      console.log(account);

      const startingDate = moment().subtract(_.random(30, 90), 'days');
      for (let transactionIndex = 0; transactionIndex < _.random(10, 30); transactionIndex++) {
        account.$relatedQuery('transactions').insert({
          amount: _.random(50, 2000) / 100.0,
          operation: _.shuffle(models.Transaction.transactionTypes)[0],
          timestamp: startingDate.subtract(_.random(transactionIndex * 24, transactionIndex * 96), 'hours').toISOString(),
        }).then(transaction => {
          console.log(transaction);
        });
      }
    });
  }
});
