'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/cards_test';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

var Card = require('../models/Card');
var User = require('../models/User');


describe('cards REST API', function() {

  before(function (done) {
    var testUser = new User({username: 'Dev Tester', email: 'testing@example.com', password: 'test'});
    testUser.genHash(testUser.basic.password, function (err, hashed) {
      testUser.basic.password = hashed;
    });
    testUser.genToken(process.env.APP_SECRET, function (err, token) {
      testUser.basic.eat = token;
    });
    testUser.save(function (err, data) {
      if (err) throw err;

      this.testUser = data;
    }.bind(this));

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
    .send({spell: 'Fireball', color: 'Red', cost: 2, eat: this.testUser.basic.eat})
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
    .send({eat: this.testUser.basic.eat})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should update existing Card', function (done) {
    chai.request('localhost:7000')
    .put('/magic/cards/' + this.testCard._id)
    .send({cost: 2, eat: this.testUser.basic.eat})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful update');
      done();
    });
  });

  it('should remove Card', function (done) {
    chai.request('localhost:7000')
    .del('/magic/cards/' + this.testCard2._id)
    .send({eat: this.testUser.basic.eat})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful removal');
      done();
    });
  });

  it('should fail data validation', function (done) {
    chai.request('localhost:7000')
    .post('/magic/cards')
    .send({color: 'Blessing', cost: 2, eat: this.testUser.basic.eat})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(405);
      expect(res.body.message).to.eql("Card validation failed");
      done();
    });
  });

  // it('should be post a 404', function (done) {
  //   chai.request('localhost:7000')
  //   .get('/magic/*')
  //   .send({eat: this.testUser.basic.eat})
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.eql(404);
  //     expect(res.body.msg).to.eql('found the dead end');
  //     done();
  //   });
  // });

});



