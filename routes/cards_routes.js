'use strict';

var Card = require('../models/Card');
var bodyparser = require('body-parser');
var Sql = require('sequelize');
var sql = new Sql('cards_dev', 'cards_dev', 'foobar123', {
  dialect: 'postgres'
});

module.exports = function (router) {
  router.use(bodyparser.json());

  router.get('/cards', function (req, res) {
    sql.sync()
    .then(function () {
      Card.all()
      .then(function (data) {
        res.json(data);
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      });
    });
  });

  router.post('/cards', function (req, res) {
    sql.sync()
    .then(function () {
      Card.create(req.body)
      .then(function (data) {
        res.json(data);
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({msg: 'iternal server error'});
      });
    });
  });

  router.put('/cards/:id', function (req, res) {
    sql.sync()
    .then(function () {
      Card.update(req.body, { where: { spell: req.params.id} })
      .then(function () {
        res.json({msg: 'successful update'});
      })
      .error(function (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      });
    });
  });

  router.delete('/cards/:id', function (req, res) {
    sql.sync()
    .then(function () {
      Card.destroy({ where: { spell: req.params.id}})
      .then(function () {
        res.json({msg: 'successful removal'});
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      });
    });
  });

  router.get('*', function (req, res) {
    res.status(404).json({msg: 'found the dead end'});
  });

};
