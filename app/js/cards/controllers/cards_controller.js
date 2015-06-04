'use strict';

require('angular/angular');

module.exports = function (app) {
  app.controller('cardsController', ['$scope', '$http', 'RESTResource', function ($scope, $http, resource) {
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

    $scope.createCard = function () {
      $http.post('/magic/cards', $scope.newCard)
        .success(function (data) {
          $scope.cards.push(data);
          $scope.newCard = null;
        })
        .error(function (data) {
          console.log(data);
          $scope.errors.push({msg: 'could not create new card'});
        });
    };

    $scope.removeCard = function (card) {
      $scope.cards.splice($scope.cards.indexOf(card), 1);
      $http.delete('/magic/cards/' + card._id)
        .error(function (data) {
          console.log(data);
          $scope.errors.push({msg: 'could not remove card: ' + card.spell});
        });
    };

    $scope.saveCard = function (card) {
      card.editing = false;
      $http.put('/magic/cards/' + card._id, card)
        .error(function (data) {
          console.log(data);
          $scope.errors.push({msg: 'could not update card'});
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
