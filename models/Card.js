'use strict';

var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  authorId: {type: String, required: true},
  spell: {type: String, required: true},
  color: {type: String, required: true},
  cost: Number
});

module.exports = mongoose.model('Card', cardSchema);
