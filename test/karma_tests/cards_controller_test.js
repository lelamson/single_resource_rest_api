'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('cards controller', function () {
  var $CtrlConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module('cardsApp'));

  beforeEach(angular.mock.inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();
    $CtrlConstructor = $controller;
  }));

  it('should be able to create a new cards controller', function () {
    var cardsController = $CtrlConstructor('cardsController', {$scope: $scope});
    expect(typeof cardsController).toBe('object');
    expect(Array.isArray($scope.errors)).toBe(true);
    expect(Array.isArray($scope.cards)).toBe(true);
    expect(Array.isArray($scope.copy)).toBe(true);
    expect(typeof $scope.getAll).toBe('function');
    expect(typeof $scope.createCard).toBe('function');
    expect(typeof $scope.removeCard).toBe('function');
    expect(typeof $scope.saveCard).toBe('function');
  });

  describe('REST functionality', function () {
    beforeEach(angular.mock.inject(function (_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      this.cardsController = $CtrlConstructor('cardsController', {$scope: $scope});
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a GET request on index', function () {
      $httpBackend.expectGET('/magic/cards').respond(200, [{_id: 101, spell: 'Fireball' , color: 'Red', cost: 2}]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.cards[0]._id).toBe(101);
      expect($scope.cards[0].spell).toBe('Fireball');
      expect($scope.cards[0].color).toBe('Red');
      expect($scope.cards[0].cost).toBe(2);
    });

  });

});
