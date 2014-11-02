var quoteTemplate,
    scope;

var renderTemplate = function(templateData) {
      scope.innerHTML = '';
      if(templateData === null) {
        scope.innerHTML = '<p>All selections removed</p>';
      } else {
        var template = quoteTemplate || templateData;
        chrome.storage.local.get(null, function(data){
          console.log('data',data); 
          for(quote in data) {
            var obj = JSON.parse(data[quote]);
            var render = template.replace(/\$title/, obj.title).replace(/\$url/g, obj.url).replace(/\$text/, obj.text).replace(/\$date/,moment(+quote).format('LLL') + ' (' + moment(+quote).fromNow() + ')');
            scope.innerHTML += render;
          }
        });
      }
};
var init = function() {
  console.log('init');
  
  scope = scope || document.getElementById('data');

  $.ajax({
    url: 'quote_template.html',
    type: 'GET',
    dataType: 'html',
    success: function(template){
      quoteTemplate = template;
      renderTemplate(template);

      $('a').live('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({url: $(this).attr('href')});
      });
     }
  });

  var $clobber = $('#js-clobber');

  $clobber.on('click', function(e) {
    console.log('clobber', e);
    e.preventDefault();
    chrome.storage.local.clear(function(){
      renderTemplate(null);
    });
  });


}

window.onload = init;
