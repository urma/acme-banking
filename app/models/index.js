'use strict';

const knexfile = require('../../knexfile.js');
const Knex = require('knex');
const { Model } = require('objection');

const knex = Knex(knexfile[process.env.NODE_ENV || 'development']);
Model.knex(knex);

module.exports = {
  User: require('./user'),
  Account: require('./account'),
  Transaction: require('./transaction'),
};