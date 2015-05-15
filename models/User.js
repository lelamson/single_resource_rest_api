'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');

var userSchema = mongoose.Schema({
  username: String,
  created: Date,
  basic: {
    email: String,
    password: String,
    eat: String
  }
});

userSchema.methods.genHash = function (password, callback) {
  bcrypt.hash(password, bcrypt.genSalt(8, function (err, salt) {
    // console.log('Salt: ' + salt);
  }), null, function (err, hashed) {
    // console.log('Hash: ' + hashed);
    callback(null, hashed);
  });
};

userSchema.methods.checkPassword = function (password, callback) {
  bcrypt.compare(password, this.basic.password, function (err, verified) {
    if (err) console.log(err);
    // console.log('Pass verified: ' + verified);
    callback(null, verified);
  });
};

userSchema.methods.genToken = function (secret, callback) {
  eat.encode({id: this._id}, secret, callback); //change this._id to unique id, UUID or GUID
};

module.exports = mongoose.model('User', userSchema);
