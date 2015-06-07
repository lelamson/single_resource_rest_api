'use strict';

module.exports = function (app) {
  app.factory('setEmpty', function () {
    return function (obj) {
      Object.keys(obj).forEach(function (key) {
        obj[key] = '';
      });
      return obj;
    };
  });
};
