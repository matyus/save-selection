'use strict';

(function (ng) {
  var app = ng.module('APP', []).run([
      '$rootScope', '$log', 'storageService',
      function ($rootScope, $log, storageService) {
      
        storageService.getQuotes().then(function (success) {
          console.log('success',success);
          $rootScope.quotes = success;
          $log.log(')))))))))',success);
        });
      }
    ]);

  return app;
}(window.angular));
