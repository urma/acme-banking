const nedb = require('nedb');
const path = require('path');

const userData = {
  model: 'user',
  email: 'ulisses.albuquerque@purehacking.com',
  salt: 'XDOfrhbSsU3ZnWA0GcK0',
  password: '5YaWW4HPGmJ5jfXv6OqvzuFVBOW8eva9aICpPWjXxsK3DduCIbqsMMO9EbuGwHgD9g3UbAKTjTRsHPv+ky/7QQ==',
};

const db = new nedb({
  filename: path.join(__dirname, '..', 'acme-banking.nedb'),
  autoload: true
});

db.insert(userData, function(err, user) {
  console.log('Created user account -- ID', user._id);
  for (var i = 0; i < 1 + Math.round(7 * Math.random()); i++) {
    var accountData = {
      model: 'account',
      accountNumber: Math.round(0xffffffff * Math.random()),
      balance: 200.0 * Math.random(),
      userId: user._id,
    };
    db.insert(accountData, function(err, account) {
      console.log('Created new account', account.accountNumber);
    });
  }
});
