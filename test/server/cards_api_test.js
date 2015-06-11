'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/cards_test';
require('../../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

var Card = require('../../models/Card');
var User = require('../../models/User');


describe('cards REST API', function() {

  before(function (done) {
    var testUser = new User({username: 'Dev Tester', email: 'testing@example.com', password: 'test'});
    testUser.genHash(testUser.basic.password, function (err, hashed) {
      testUser.basic.password = hashed;
    });
    testUser.genToken(process.env.APP_SECRET, function (err, token) {
      testUser.basic.eatTest = token;
    });
    testUser.save(function (err, data) {
      if (err) throw err;

      this.testUser = data;
    }.bind(this));

    var testCard = new Card({authorId: '101', spell: 'Growth', color: 'Green', cost: 1});
    testCard.save(function (err, data) {
      if (err) throw err;

      this.testCard = data;
    }.bind(this));

    var testCard2 = new Card({authorId: '102', spell: 'Acid Rain', color: 'Black', cost: 4});
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

  it('should fail login without token', function (done) {
    chai.request('localhost:7000')
    .get('/magic/cards')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('not authorized');
      done();
    });
  });

  it('should be able to create new Card', function (done) {
    chai.request('localhost:7000')
    .post('/magic/cards')
    .send({authorId: '201', spell: 'Fireball', color: 'Red', cost: 2, eat: this.testUser.basic.eatTest})
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
    .send({eat: this.testUser.basic.eatTest})
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
    .send({cost: 2, eat: this.testUser.basic.eatTest})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful update');
      done();
    });
  });

  it('should remove Card', function (done) {
    chai.request('localhost:7000')
    .del('/magic/cards/' + this.testCard2._id)
    .send({eat: this.testUser.basic.eatTest})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('successful removal');
      done();
    });
  });

  it('should fail data validation', function (done) {
    chai.request('localhost:7000')
    .post('/magic/cards')
    .send({spell: 'Blessing', cost: 2, eat: this.testUser.basic.eatTest})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(405);
      expect(res.body.message).to.eql("Card validation failed");
      done();
    });
  });

});

describe('authorization routes', function () {

  after(function (done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should create a new user', function (done) {
    chai.request('localhost:7000')
    .post('/magic/create_user')
    .send({username: 'Example', email: 'test@example.com', password: 'password1'})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('token');
      console.log(res.body);
      done();
    });
  });

  it('should let user sign in', function (done) {
    chai.request('localhost:7000')
    .get('/magic/sign_in')
    .auth('test@example.com', 'password1')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('token');
      console.log(res.body);
      done();
    });
  });

  it('should fail sign in with wrong password', function (done) {
    chai.request('localhost:7000')
    .get('/magic/sign_in')
    .auth('test@example.com', 'bogus')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      expect(res.text).to.eql('wrong password\n');
      done();
    });
  });

});

