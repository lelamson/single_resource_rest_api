'use strict';

var Sql = require('sequelize');
var sql = new Sql('cards_dev', 'cards_dev', 'foobar123', {
  dialect: 'postgres'
});

var Card = module.exports = sql.define('Card', {
  spell: { type: Sql.STRING, allowNull: false},
  color: { type: Sql.STRING, allowNull: false},
  cost: { type: Sql.INTEGER, allowNull: true}
});

Card.sync();
