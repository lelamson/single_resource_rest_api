'use strict';

module.exports = function (app) {
  app.directive('logoutDirective', function () {
    return {
      restrict: 'AC',
      replace: true,
      scope: {},
      template: '<div data-ng-show="signedIn()"><button type="button" data-ng-click="signOut()">Logout</button></div>',
      controller: ['$scope', '$location', 'auth', function ($scope, $location, auth) {
        $scope.signedIn = function () {
          return auth.isSignedIn();
        };

        $scope.signOut = function () {
          auth.logout();
          $location.path('/sign_in');
        };
      }]
    };
  });
};
