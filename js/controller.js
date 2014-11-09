'use strict';

(function (ng, runtime) {
  var app = ng.module('APP');

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
    '$scope', '$rootScope', 'storageService', 
    function ($scope, $rootScope, storageService) {
      $scope.deleteAll = function() {
        console.log('d');
        storageService.removeQuotes().then(function(){
           storageService.getQuotes().then(function(success){
            $rootScope.quotes = success;
           });
        });
      };
    }
  ]);

  app.controller('ActionsCtrl', [
    '$scope', '$rootScope', 'storageService', 
    function ($scope, $rootScope, storageService) {
      $scope.openSavedSelection = function ($event) {
        var $this = $event;
        runtime.sendMessage(
          {
            action: 'openQuote',
            url: $this.currentTarget.dataset.href,
            quote: $this.currentTarget.dataset.quote
          },
          function(response) {
            console.log('response from background', response);
          }
        );
      };

      $scope.deleteItem = function (key) {
        storageService.removeQuote(key).then(function () {
          storageService.getQuotes().then(function(success){
            $rootScope.quotes = success;
          });
        });
      }

      $scope.emailItem = function (key, quote) {
        storageService.getQuote(key).then(function () {
          runtime.sendMessage(
            {
              action: 'emailQuote',
              quote: quote.text,
              title: quote.title,
              url: quote.url
            },
            function(response) {
              consolelog('response to emailItem request', response);
            }
          );
        });
      }
    }
  ]);

  return app;
}(window.angular, window.chrome.runtime));
