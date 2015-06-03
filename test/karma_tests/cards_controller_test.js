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
      expect($scope.errors.length).toBe(0);
    });

    it('should create a new card', function () {
      $scope.newCard = {spell: 'Angel', color: 'White', cost: 4};
      $httpBackend.expectPOST('/magic/cards').respond(200, {_id: 102, spell: 'Angel', color: 'White', cost: 4});
      $scope.createCard();
      $httpBackend.flush();
      expect($scope.cards[0]._id).toBe(102);
      expect($scope.cards[0].spell).toBe('Angel');
      expect($scope.cards[0].color).toBe('White');
      expect($scope.cards[0].cost).toBe(4);
      expect($scope.newCard).toBe(null);
      expect($scope.errors.length).toBe(0);
    });

    it('should delete a card', function () {
      var card = {_id: 103, spell: 'Raven', color: 'Black', cost: 1};
      $scope.cards.push(card);
      $httpBackend.expectDELETE('/magic/cards/103').respond(200, {msg: 'successful removal'});
      expect($scope.cards.indexOf(card)).not.toBe(-1);
      $scope.removeCard(card);
      expect($scope.cards.indexOf(card)).toBe(-1);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(0);
    });

    it('should delete a card even with server error', function () {
      var card = {_id: 104, spell: 'Fall', color: 'Blue', cost: 1};
      $scope.cards.push(card);
      $httpBackend.expectDELETE('/magic/cards/104').respond(500, {msg: 'card delete error'});
      expect($scope.cards.indexOf(card)).not.toBe(-1);
      $scope.removeCard(card);
      expect($scope.cards.indexOf(card)).toBe(-1);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
    });

    it('should update a card', function () {
      var card = {_id: 105, spell: 'Giant Growth', color: 'Green', cost: 4};
      $scope.cards.push(card);
      $httpBackend.expectPUT('/magic/cards/105').respond(200, {_id: 105, spell: 'Giant Growth', color: 'Green', cost: 3});
      expect($scope.cards[0].cost).toBe(3);
      $scope.saveCard(card);
      expect($scope.cards[0].cost).toBe(4);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(0);
    });

  });

});
