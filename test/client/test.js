'use strict';

var expect = require('chai').expect;
var color = require('../../app/js/color');

describe('magic module', function() {
  it('should return card colors', function() {
    expect(color()).to.eql('Colors in the collection are: White, Blue, Black, Red, & Green!');
  });
});
