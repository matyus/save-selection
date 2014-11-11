'use strict';

(function (ng, runtime) {
  var app = ng.module('APP');

  app.config(function($sceProvider) {
    //Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
  });

  app.controller('QuoteCtrl', [
    '$scope', '$rootScope', '$log', 'storageService',
    function ($scope, $rootScope, $log, storageService) {
      $scope.quotes = $rootScope.quotes;

      $scope.init = function () {
        console.log('go');
      };

      $scope.init();
    }
  ]);

  app.controller('NavCtrl', [
    '$sce', '$scope', '$rootScope', 'storageService', 
    function ($sce, $scope, $rootScope, storageService) {
      $scope.deleteAll = function() {
        console.log('d');
        storageService.removeQuotes().then(function(){
           storageService.getQuotes().then(function(success){
            $rootScope.quotes = $sce.trustAsHtml(success);
           });
        });
      };
    }
  ]);

  app.controller('ActionsCtrl', [
    '$sce', '$scope', '$rootScope', 'storageService', 
    function ($sce, $scope, $rootScope, storageService) {
      $scope.openSavedSelection = function (key) {
        storageService.getQuote(key).then(function(response){
          var quote = response[key];
          runtime.sendMessage({
            action: 'openQuote',
            quote: quote
          });
        });
      };

      $scope.deleteItem = function (key) {
        storageService.removeQuote(key).then(function () {
          storageService.getQuotes().then(function(success){
            $rootScope.quotes = success;
          });
        });
      }

      $scope.emailItem = function (key) {
        storageService.getQuote(key).then(function (response) {
          var quote = response[key];
          runtime.sendMessage({
            action: 'emailQuote',
            quote: quote
          });
        });
      }
    }
  ]);

  return app;
}(window.angular, window.chrome.runtime));
