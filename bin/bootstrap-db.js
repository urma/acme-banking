/* eslint no-console: 0 */
'use strict';

const nedb = require('nedb');
const path = require('path');

const userData = {
  model: 'user',
  email: 'user@domain.com',
  salt: 'XDOfrhbSsU3ZnWA0GcK0',
  password: '5YaWW4HPGmJ5jfXv6OqvzuFVBOW8eva9aICpPWjXxsK3DduCIbqsMMO9EbuGwHgD9g3UbAKTjTRsHPv+ky/7QQ==',
};

const db = new nedb({
  filename: path.join(__dirname, '..', 'acme-banking.nedb'),
  autoload: true
});

db.insert(userData, function(err, user) {
  console.log('Created user account', user);
  for (var i = 0; i < 1 + Math.round(7 * Math.random()); i++) {
    var accountData = {
      model: 'account',
      accountNumber: Math.round(0xffffff * Math.random()),
      balance: 0.0,
      userId: user._id,
    };

    db.insert(accountData, function(err, account) {
      console.log('* Created new account', account);

      for (var j = 0; j < 4 + Math.round(10 * Math.random()); j++) {
        var depositData = {
          model: 'transaction',
          operation: 'deposit',
          accountId: account._id,
          amount: Math.round(10000 * Math.random()) / 100.0,
          timestamp: new Date(),
        };
        db.insert(depositData, function(err, transaction) {
          console.log('  * Created deposit transaction', transaction);
          var accountQuery = {
            model: 'account',
            _id: account._id,
          };
          var accountUpdate = {
            $inc: {
              balance: transaction.amount,
            },
          };
          db.update(accountQuery, accountUpdate, function(err) {
            if (err) { console.error(err); }
            console.log('  * Account balance updated');
          });
        });
      }

      for (var k = 0; k < 2 + Math.round(8 * Math.random()); k++) {
        var withdrawData = {
          model: 'transaction',
          operation: 'withdraw',
          accountId: account._id,
          amount: Math.round(5000 * Math.random()) / 100.0,
          timestamp: new Date(),
        };
        db.insert(withdrawData, function(err, transaction) {
          console.log('  * Created deposit transaction', transaction);
          var accountQuery = {
            model: 'account',
            _id: account._id,
          };
          var accountUpdate = {
            $inc: {
              balance: -1.0 * transaction.amount,
            },
          };
          db.update(accountQuery, accountUpdate, function(err) {
            if (err) { console.error(err); }
            console.log('  * Account balance updated');
          });
        });
      }
    });
  }
});
