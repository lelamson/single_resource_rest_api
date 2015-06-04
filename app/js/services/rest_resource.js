'use strict';

module.exports = function (app) {

  var handleSuccess = function (callback) {
    return function (data) {
      callback(null, data);
    };
  };

  var handleError = function (callback) {
    return function (data) {
      console.log(data);
      callback(data);
    };
  };

  app.factory('RESTResource', ['$http', function ($http) {
    return function (resourceName) {
      return {
        getAll: function (callback) {
          $http.get('/magic/' + resourceName)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        create: function (resourceData, callback) {
          $http.post('/magic/' + resourceName, resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        save: function (resourceData, callback) {
          $http.put('/magic/' + resourceName + '/' + resourceData._id, resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        remove: function (resourceData, callback) {
          $http.delete('/magic/' + resourceName + '/' + resourceData._id)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        }

      };
    };

  }]);

};
