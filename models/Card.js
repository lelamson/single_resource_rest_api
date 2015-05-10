'use strict';

var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  Color: String,
  Spell: String,
  Cost: Number
});

module.exports = mongoose.model('Card', cardSchema);
