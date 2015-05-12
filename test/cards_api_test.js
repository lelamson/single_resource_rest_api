'use strict';

require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

var Card = require('../models/Card');
var Sql = require('sequelize');
var sql = new Sql('cards_dev_test', 'cards_dev', 'foobar123', {
  dialect: 'postgres'
});

describe('cards REST API', function() {

  before(function (done) {
    Card.sync({force: true})
      .then(function() {
        Card.create({spell: 'Growth', color: 'Green', cost: 1});
        Card.create({spell: 'Acid Rain', color: 'Black', cost: 4});
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
      expect(res.body).to.have.property('id');
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
      done();
    });
  });

  it('should update existing Card', function (done) {
    chai.request('localhost:7000')
    .put('/magic/cards/' + 'Growth')
    .send({cost: 2})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful update');
      done();
    });
  });

  it('should remove Card', function (done) {
    chai.request('localhost:7000')
    .del('/magic/cards/' + 'Acid Rain')
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

});



