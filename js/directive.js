'use strict';

(function(ng) {
  var app = ng.module('APP');
  
  app.directive('quote-template', function(){
    return {
      restrict: 'E',
      scope: {
        data: "=data",
        date: "=date"
      },
      templateUrl: 'quote.html'
    }
  });

  return app;
}(window.angular));
