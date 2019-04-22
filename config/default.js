const path = require('path');
const util = require('util');

const dbFile = util.format('%s.db', process.env.NODE_ENV || 'dev');

module.exports = {
  database: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.join(__dirname, '../db', dbFile),
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  }
};