'use strict';

var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  spell: String,
  color: String,
  cost: Number
});

module.exports = mongoose.model('Card', cardSchema);
