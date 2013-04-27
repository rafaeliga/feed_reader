$(function() {
  console.log('READER START');

  get_urls()

  $('#search_feed').on("click", function() {
    var url_to_search = $('#term').val();

    if(!url_to_search.match(/http:\/\//)) {
      url_to_search = "http://"+url_to_search;
    }

    search(url_to_search);
  });
});

function message(val) {
  console.log(val);
}

function search(url) {
  save_feed(url);

  $.ajax({
    type: 'GET',
    url: url,
    success: function(data, textStatus, request){
      var content_type = request.getResponseHeader('Content-Type');
      console.log(content_type)
      
      if (content_type.match(/text\/html/)) {
        console.log('HTML parse')
        var link_rss = $(data).filter("link[type='application/rss+xml']");
        var rss_link = link_rss.attr('href');
        search(rss_link)

      } else if (content_type.match(/xml/)) {
        show_item_from_feed(data);
      }
    },
    error: function (request, textStatus, errorThrown) {
      console.log(request.getResponseHeader('Content-Type'));
      console.log('f')
    }
  });
}

function show_item_from_feed(xml) {
  $xml = $( xml );
  $channel = $xml.find( "channel" )
  $divchannels = $("#channels");

  var appendHtml = "";
  appendHtml += "<a >"
  appendHtml += " <ul>"

  $channel.find("item").each( function(){
    
    appendHtml += fetchItemAsHTML($(this));
  });

  appendHtml += "</ul>"
  appendHtml += "</a>"
  $divchannels.html(appendHtml);
}


function fetchItemAsHTML(item){
  console.log(item);
  var returnHtml = "<li>";

  var title = "";
  var link = "";
  var pubDate = "";

  title = item.find("title").text() + "<br>";
  link = item.find("link").text() + "<br>";
  pudDate = item.find("pubDate").text() + "<br>";

  console.log(title);
  console.log(link);
  console.log(pubDate);


  returnHtml += title;
  returnHtml += link;
  returnHtml += pubDate;

  returnHtml += "</li>";

  console.log(returnHtml);

  return returnHtml;
}

function save_feed(url) {
  var urls = [{url:url}];

  chrome.storage.sync.set({'feed_urls': [urls]}, function() {
    message('URLs saved');
  });
}

function get_urls() {
  chrome.storage.sync.get('feed_urls', function(items) {
    $.each(items['feed_urls'], function(key, value) {
      message(key)
      message(value)
    })
  });
}