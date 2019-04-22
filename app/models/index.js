'use strict';

const config = require('config');
const Knex = require('knex');
const { Model } = require('objection');

const knex = Knex(config.get('database'));
Model.knex(knex);

module.exports = {
  User: require('./user'),
  Account: require('./account'),
  Transaction: require('./transaction'),
};