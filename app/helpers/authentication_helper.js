const crypto = require('crypto');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-require
const db = require(path.resolve(__dirname, '../models'));

module.exports = {
  authenticate: function(email, password) {
    return new Promise((resolve, reject) => {
      db.model('user').findOne({ where: { email: email } }).then((user) => {
        if (user && user.passwordSalt && user.passwordHash) {
          const hash = crypto.createHash('sha512');
          hash.update(password);
          hash.update(user.passwordSalt);
          if (user.passwordHash === hash.digest('hex')) {
            return resolve(user);
          }
        }

        return reject('Invalid username and/or password');
      }).catch((err) => {
        return reject(err);
      });
    });
  },
};
