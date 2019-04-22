// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/dev.db',
    },
  },
  staging: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/staging.db',
    },
  },
  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/production.db',
    },
  },
};
