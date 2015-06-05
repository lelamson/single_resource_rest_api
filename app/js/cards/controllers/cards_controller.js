'use strict';

require('angular/angular');

module.exports = function (app) {
  app.controller('cardsController', ['$scope', '$http', 'RESTResource', 'copy',
                 'setEmpty', function ($scope, $http, resource, copy, empty) {
    var Card = resource('cards');
    $scope.errors = [];
    $scope.cards = [];

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
      card.backup = undefined;
      Card.save(card, function (err, data) {
        if (err) return $scope.errors.push({msg: 'could not update card'});
      });
    };

    $scope.toggleEdit = function (card) {
      if (card.editing) {
        card.editing = false;
        $scope.cards.splice($scope.cards.indexOf(card), 1, card.backup);
      } else {
        card.backup = copy(card);
        card.editing = true;
      }
    };

  }]);
};
