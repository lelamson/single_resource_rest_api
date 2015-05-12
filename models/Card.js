'use strict';

// var mongoose = require('mongoose');
var Sql = require('sequelize');
var sql = new Sql('cards_dev', 'cards_dev', 'foobar123', {
  dialect: 'postgres'
});

var Card = module.exports = sql.define('Card', {
  spell: { type: Sql.STRING, allowNull: false}, //{type: String, required: true},
  color: { type: Sql.STRING, allowNull: false}, //{type: String, required: true},
  cost: { type: Sql.INTEGER, allowNull: true}
});

Card.sync();
// module.exports = mongoose.model('Card', cardSchema);
