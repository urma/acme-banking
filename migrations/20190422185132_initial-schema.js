'use strict';

exports.up = knex => {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').index().notNullable();
      table.string('passwordHash').notNullable();
      table.boolean('enabled').notNullable().defaultTo(true);
      table.unique([ 'username' ]);
      table.unique([ 'email' ]);
    })
    .createTable('accounts', table => {
      table.increments('id').primary();
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index()
        .notNullable();
      table.string('accountNumber').index().notNullable();
      table.unique([ 'accountNumber' ]);
    })
    .createTable('transactions', table => {
      table.increments('id').primary();
      table
        .integer('accountId')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
        .index()
        .notNullable();
      table.float('amount').notNullable();
      table.enu('operation', [
        'deposit', 'withdrawal', 'payment'
      ]).notNullable();
      table.timestamp('timestamp').notNullable();
    });
};

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('accounts')
    .dropTableIfExists('users');
};
