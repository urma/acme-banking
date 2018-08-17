const path = require('path');

module.exports = {
  // eslint-disable-next-line security/detect-non-literal-require
  auth: require(path.resolve(__dirname, 'authentication_helper')),
};