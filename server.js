'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var app = express();
var port = 7000;

process.env.APP_SECRET = process.env.APP_SECRET || 'place holder';

var cardRoutes = express.Router();
var userRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/cards_dev');

app.use(passport.initialize());

app.use(express.static(__dirname + '/build'));

require('./lib/passport_strat')(passport);

require('./routes/cards_routes')(cardRoutes);
require('./routes/auth_routes')(userRoutes, passport);

app.use('/magic', cardRoutes);
app.use('/magic', userRoutes);

app.listen(process.env.PORT || port, function() {
  console.log('Server running on port: ' + (process.env.PORT || port));
});


