'use strict';

(function (ng) {
  var app = ng.module('APP', []).run([
    '$rootScope', '$log', 'storageService',
    function ($rootScope, $log, storageService) {
      storageService.getQuotes().then(function (success) {
        $rootScope.quotes = success;
      });
    }
  ]);

  return app;
}(window.angular));
