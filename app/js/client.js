'use strict';

require('angular/angular');

var cardsApp = angular.module('cardsApp', []);

require('./cards/controllers/cards_controller')(cardsApp);
