/* eslint no-console: 0 */
'use strict';

const path = require('path');

const models = require(path.resolve(__dirname, '../app/models'));

models.sync({ force: true }).then((db) => {
  /* Create user and accounts */
  const userData = {
    username: 'ulisses.albuquerque',
    email: 'ulisses.albuquerque@securusglobal.com',
    password: 'password',
    accounts: Array.from({ length: 3 + Math.round(8 * Math.random()) }, () => {
      return {
        accountNumber: `${Math.round(1000 + 9000 * Math.random())}-${Math.round(0xffff * Math.random())}`,
      };
    }),
  };

  db.model('user').create(userData, { include: [ db.model('account') ]}).then((user) => {
    const transactions = user.accounts.map((account) => {
      return Array.from({ length: 10 + Math.round(10 * Math.random()) }, () => {
        return db.model('transaction').create({
          accountId: account._id,
          timestamp: new Date(Date.now() - Math.round(10000 + 10000000 * Math.random())),
          amount: 1500 * Math.random(),
          operation: [ 'deposit', 'withdrawal', 'payment' ][Math.floor(3 * Math.random())],
        });
      });
    }).reduce((state, list) => {
      return state.concat(list);
    }, []);

    Promise.all(transactions).then(() => {
      console.log('*** Database populated successfully ***');
      db.close();
    }).catch((err) => {
      console.error('*** Error while populating database:', err);
      db.close();
    });
  }).catch((err) => {
    console.error('Error while populating database', err);
  });
});