'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/cards_test';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var expect = chai.expect;

var Card = require('../models/Card');

describe('cards REST API', function() {

  before(function (done) {
    var testCard = new Card({spell: 'Growth', color: 'Green', cost: 1});
    testCard.save(function (err, data) {
      if (err) throw err;

      this.testCard = data;
    }.bind(this));

    var testCard2 = new Card({spell: 'Acid Rain', color: 'Black', cost: 4});
    testCard2.save(function (err, data) {
      if (err) throw err;

      this.testCard2 = data;
      done();
    }.bind(this));

  });

  after(function (done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to create new Card', function (done) {
    chai.request('localhost:7000')
    .post('/magic/cards')
    .send({spell: 'Fireball', color: 'Red', cost: 2})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.spell).to.eql('Fireball');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  it('should get array of Cards', function (done) {
    chai.request('localhost:7000')
    .get('/magic/cards')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      expect(Array.isArray(res.body)).to.eql(true);
      // console.log(res.body);
      done();
    });
  });

  it('should update existing Card', function (done) {
    chai.request('localhost:7000')
    .put('/magic/cards/' + this.testCard._id)
    .send({cost: 2})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful update');
      done();
    });
  });

  it('should remove Card', function (done) {
    chai.request('localhost:7000')
    .del('/magic/cards/' + this.testCard2._id)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful removal');
      done();
    });
  });

  it('should be post a 404', function (done) {
    chai.request('localhost:7000')
    .get('/magic/*')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(404);
      expect(res.body.msg).to.eql('found the dead end');
      done();
    });
  });

  it('should fail validation when saving', function (done) {
    chai.request('localhost:7000')
    .post('/magic/cards')
    .send({spell: 'Blessing', cost: 2})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      expect(res.body.msg).to.eql('internal server error');
      done();
    });
  });

  //display database
  it('query final collection', function (done) {
    chai.request('localhost:7000')
    .get('/magic/cards')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      expect(Array.isArray(res.body)).to.eql(true);
      // console.dir(res.body);
      done();
    });
  });

});



