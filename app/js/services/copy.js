'use strict';

module.exports = function (app) {
  app.factory('copy', function () {
    return function (obj) {
      var objCopy = {};
      Object.keys(obj).forEach(function(key) {
       objCopy[key] = obj[key];
      });
      return objCopy;
    };
  });
};
