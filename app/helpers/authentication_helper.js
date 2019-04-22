// eslint-disable-next-line security/detect-non-literal-require
const models = require('../models');

module.exports = {
  authenticate: async (email, password) => {
    const users = await models.User
      .query()
      .where('email', '=', email)
      .where('enabled', '=', true)
      .limit(1);

    if (users.length > 0 && users[0].authenticate(password)) {
      return users[0];
    }
    else {
      throw new Error('Invalid username and/or password');
    }
  },
};
