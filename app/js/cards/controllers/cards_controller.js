'use strict';

require('angular/angular');

module.exports = function (app) {
  app.controller('cardsController', ['$scope', '$http', 'RESTResource', 'setEmpty', function ($scope, $http, resource, empty) {
    var Card = resource('cards');
    $scope.errors = [];
    $scope.cards = [];
    $scope.copy = [];

    $scope.getAll = function () {
      Card.getAll(function (err, data) {
        if (err) return $scope.errors.push({msg: 'error retrieving cards'});
        $scope.cards = data;
      });
    };

    $scope.createCard = function (card) {
      var newCard = angular.copy(card);
      card = empty(card);
      $scope.cards.push(newCard);
      Card.create(newCard, function (err, data) {
        if (err) return $scope.errors.push({msg: 'could not create new card: ' + newCard.spell});
        $scope.cards.splice($scope.cards.indexOf(newCard), 1, data);
      });
    };

    $scope.removeCard = function (card) {
      $scope.cards.splice($scope.cards.indexOf(card), 1);
      Card.remove(card, function (err, data) {
        if (err) return $scope.errors.push({msg: 'could not remove card: ' + card.spell});
      });
    };

    $scope.saveCard = function (card) {
      card.editing = false;
      Card.save(card, function (err, data) {
        if (err) return $scope.errors.push({msg: 'could not update card'});
      });
    };

    $scope.edit = function () {
      $scope.copy = angular.copy($scope.cards);
    };

    $scope.reset = function (card) {
      var loc = $scope.cards.indexOf(card);
      $scope.cards.splice(loc, 1, $scope.copy[loc]);
    };

  }]);
};
