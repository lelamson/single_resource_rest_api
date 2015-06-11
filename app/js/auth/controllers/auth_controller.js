'use strict';

module.exports = function (app) {
  app.controller('authController', ['$scope', '$location', 'auth', function ($scope, $location, auth) {
      $scope.errors = [];

      if (auth.isSignedIn()) $location.path('/cards');

      $scope.authSubmit = function (user) {
        if (user.password_confirmation) {
          auth.create(user, function (err) {
            if(err) {
              console.log(err);
              return $scope.errors.push({msg: 'could not create user'});
            }
            $location.path('/cards');
          });
        } else {
          auth.signIn(user, function (err) {
            if (err) {
              console.log(err);
              return $scope.errors.push({msg: 'could not sign in'});
            }

            $location.path('/cards');
          });
        }
      };
  }]);
};
