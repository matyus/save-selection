'use strict';

(function(ng, db) { 
  var app = ng.module('APP');

  app.service('storageService', [
      '$q',
      function ($q) {

        return({
          addQuote: addQuote,
          getQuotes: getQuotes,
          removeQuote: removeQuote,
          removeQuotes: removeQuotes
        });

        function getQuotes () {
          console.log('get quotes'); 

          var deferred = $q.defer();

          deferred.notify('Getting Quotes');

          db.get(null, function(data){
            console.log('db.get',data);
            if(chrome.runtime.lastError) {
              deferred.reject();
            } else {
              deferred.resolve(data);
            }
          });

          return deferred.promise;
        };

        function removeQuote (quoteKey) {
          var deferred = $q.defer();

          deferred.notify('Removing Quote');

          db.remove(quoteKey, function() {
            console.log('db.remove');
            if(chrome.runtime.lastError) {
              deferred.reject();
            } else {
              deferred.resolve();
            }
          });

          return deferred.promise;
        };

        function removeQuotes () {
          var deferred = $q.defer();

          deferred.notify('Removing All Quotes');

          db.clear(function() {
            console.log('err', chrome.runtime.lastError);
            if(chrome.runtime.lastError) {
              deferred.reject();
            } else {
              deferred.resolve();
            }
          });

          return deferred.promise;
        };

        function addQuote (obj) {
          var deferred = $q.defer();

          deferred.notify('Adding a Quote');

          var quote = {};
          var createdOn = new Date().getTime();
          quote[createdOn] = {
            text: 'text',
            title: 'title',
            url: 'url'
          };

          db.set(quote, function(item) {
            if(chrome.runtime.lastError) {
              deferred.reject();
            } else {
              deferred.resolve();
            }
          });

          return deferred.promise;
        };
      }
  ]);

  return app;
}(window.angular,window.chrome.storage.local));
