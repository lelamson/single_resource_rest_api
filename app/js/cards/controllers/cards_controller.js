'use strict';

module.exports = function (app) {
  app.controller('cardsController', ['$scope', '$http', function ($scope, $http) {
    $scope.errors = [];
    $scope.cards = [];

    $scope.getAll = function () {
      $http.get('/magic/cards')
        .success(function (data) {
          $scope.cards = data;
        })
        .error(function (data) {
          console.log(data);
          $scope.errors.push({msg: 'error retrieving cards'});
        });
    };

    $scope.createCard = function () {
      $http.post('magic/cards', $scope.newCard)
        .success(function (data) {
          $scope.cards.push(data);
          $scope.newCard = null;
        })
        .error(function (data) {
          console.log(data);
          $scope.errors.push({msg: 'could not create new card'});
        });
    };



  }]);
};
