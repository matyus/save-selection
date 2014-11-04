var parentMenu = chrome.contextMenus.create({
  "contexts": ["all"],
  "id": "parent",
  "title": "Save Selection",
  "type": "normal"
});

chrome.contextMenus.onClicked.addListener(function($event,tab){
  console.log('e',$event, $event.selectionText);
  console.log('t',tab);

  var quote = {};
  var createdOn = new Date().getTime();

  quote[createdOn] = {
    text: $event.selectionText,
    title: tab.title,
    url: tab.url
  };

  chrome.storage.local.set(quote, function(item){
    console.log('saved',item);
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
    console.log(request, sender, callback);
    if(request.action === 'openQuote') {
      openTabAndFindQuote(request);
    }
  }
);

var openTabAndFindQuote = function(request) {
  chrome.tabs.create(
    {
      url: request.url
    },
    function(tab) {
      chrome.tabs.get(tab.id, function() {
        chrome.tabs.executeScript(
          tab.id,
          { code: "window.find('"+request.quote+"')" }
        );
      });
    }
  );
};
