var key,quote;
var parentMenu = chrome.contextMenus.create({
  "contexts": ["all"],
  "id": "parent",
  "title": "Save Selection",
  "type": "normal"
});

chrome.contextMenus.onClicked.addListener(function($event,tab){
  chrome.tabs.sendMessage(tab.id, 'getSelection', function(response){
    console.log('aaah',response);
    storageService.addQuote(response);
  });
});

chrome.browserAction.onClicked.addListener(function(tab){
  console.log('browserAction.onClicked',tab);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

chrome.commands.onCommand.addListener(function(eventName) {
  console.log('onCommand');
  if(eventName === 'save-selection') {
    saveSelection();
  }
});

var saveSelection = function(){
  chrome.tabs.getSelected(null, function(tab) {
    console.log('tab!',tab);
    chrome.tabs.sendMessage(tab.id, 'getSelection', function(e){
      console.log('cb,e,', e);
    });
  });
};

chrome.extension.onMessage.addListener(
  function(request, sender, callback) {
    console.log('bg onMessage', request, sender);
    switch(request.action) {
      case 'emailQuote':
        openTabAndCreateEmail(request);
        break;
      case 'openQuote':
        console.log('open', request, sender);
        openTabAndFindQuote(request);
        break;
      case 'findQuote':
        findQuote(sender);
        break;
      case 'saveSelection':
        console.log('SAVE', request, sender, callback);
        break;
      default:
        console.log('nothing happened');
    }
  }
);
var findQuote = function(request) {
  var tab = request.tab;
  console.log('!!!', quote);
  chrome.tabs.executeScript(tab.id, {
    code: 'window.find("$");'.replace('$',quote.text)
  });
};

var openTabAndFindQuote = function(request) {
  key = quote = request.quote;
  chrome.tabs.create(
    {
      url: quote.url
    },
    function(tab) {
      chrome.tabs.get(tab.id, function() {
        chrome.tabs.executeScript(
          tab.id,
          { code: "window.find('"+quote.text+"');" }
        );
      });
    }
  );
};

var openTabAndCreateEmail = function(response) {
  var quote = response.quote;

  chrome.tabs.create({
    url: 'https://mail.google.com/mail/?view=cm&su='
      + encodeURIComponent('[excerpt]')+'&body=' 
      + encodeURIComponent(quote.title+'\n\n“'+ quote.text +'”\n\n' + 'via '+quote.url)
  });
};
