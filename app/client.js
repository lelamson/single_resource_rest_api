'use strict';

var color = require('./color');
var colorEl = document.getElementById('colortype');
var cardList = document.getElementById('cardlist');
var request = require('superagent');

colorEl.innerHTML = color();

request
  .get('/magic/cards')
  .end(function (err, res) {
    if (err) return console.log(err);
    var cards = JSON.parse(res.text);

    cards.forEach(function (card) {
      var cardEl = document.createElement('li');
      cardEl.innerHTML = card.color + ': ' + card.spell;
      cardList.appendChild(cardEl);
    });
});
