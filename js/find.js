console.log('content_script', document.readyState);

chrome.runtime.sendMessage({action:'findQuote'});

chrome.runtime.onMessage.addListener(function(request,sender,callback){
  console.log('woop', request, sender,callback);
  if(request === 'getSelection') {
    var selection = window.getSelection();
    callback({
      action: 'saveSelection',
      text: selection.toString(),
      $el: selection.baseNode.parentElement.innerHTML,
      url: document.URL,
      title: document.title,
      referrer: document.referrer
    });
  }
});
