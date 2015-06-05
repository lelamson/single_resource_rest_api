'use strict';

require('angular/angular');

var cardsApp = angular.module('cardsApp', []);


//Services
require('./services/copy')(cardsApp);
require('./services/set_empty')(cardsApp);
require('./services/rest_resource')(cardsApp);

//Controllers
require('./cards/controllers/cards_controller')(cardsApp);


//Directives
