'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var port = 7000;

var cardRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/cards_dev');

require('./routes/cards_routes')(cardRoutes);

app.use('/magic', cardRoutes);

app.listen(process.env.PORT || port, function() {
  console.log('Server running on port: ' + (process.env.PORT || port));
})

