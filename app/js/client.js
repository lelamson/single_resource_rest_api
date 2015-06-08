'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

var cardsApp = angular.module('cardsApp', ['ngRoute', 'ngCookies', 'base64']);

//Services
require('./services/copy')(cardsApp);
require('./services/set_empty')(cardsApp);
require('./services/rest_resource')(cardsApp);
require('./auth/services/auth')(cardsApp);


//Controllers
require('./cards/controllers/cards_controller')(cardsApp);
require('./auth/controllers/auth_controller')(cardsApp);


//Directives
require('./cards/directives/card_form_directive')(cardsApp);
require('./auth/directives/logout_directive')(cardsApp);

cardsApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/sign_in', {
      templateUrl: 'templates/views/sign_in.html',
      controller: 'authController'
    })
    .when('/create_user', {
      templateUrl: 'templates/views/create_user.html',
      controller: 'authController'
    })
    .when('/cards', {
      templateUrl: 'templates/views/cards_view.html',
      controller: 'cardsController'
    })
    .when('/', {
      redirectTo: '/sign_in'
    })
    .otherwise({
      redirectTo: '/sign_in'
    });
}]);
