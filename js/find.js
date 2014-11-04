console.log('content_script', document.readyState);

var find = function() {
  chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    console.log('stuff', message, sender, callback);
    window.find(message.quote);
  });
};

find();
