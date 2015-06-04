'use strict';

require('angular/angular');

var cardsApp = angular.module('cardsApp', []);


//Services
require('./services/rest_resource')(cardsApp);
require('./services/set_empty')(cardsApp);

//Controllers
require('./cards/controllers/cards_controller')(cardsApp);


//Directives
