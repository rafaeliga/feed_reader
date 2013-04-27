$(function() {
  console.log('READER START');

  get_urls()

  // Open Dialog
  $(".open_dialog").on("click", function(){
    $("#box_add_feed").fadeToggle("fast", "linear");
  });
  //  Search Feed
  $('#search_feed').on("click", function() {
    var url_to_search = $('#term').val();

    if(!url_to_search.match(/http:\/\//)) {
      url_to_search = "http://"+url_to_search;
    }

    search(url_to_search);
  });


  $('.show_feed').on("click", function() {
    e.stopImmediatePropagation();
    e.preventDefault();

    message('lakdgnbn')
    message(event)
    show_content($(this).data('content'), $(this).data('media-url'));

    return false;
  });

});


function message(val) {
  console.log(val);
}

function search(url) {
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
        console.log('XML parse')
        show_item_from_feed(url, data);
      }
    },
    error: function (request, textStatus, errorThrown) {
      console.log(request.getResponseHeader('Content-Type'));
      console.log('f')
    }
  });
}

function show_item_from_feed(url, xml) {
  $xml = $( xml );
  $channel = $xml.find( "channel" )
  $divchannels = $("#channels");

  var appendHtml = "";

  var items = [];

  $channel.find("item").each( function(){
    
    // appendHtml += fetchItemAsHTML($(this));

    var item = {};
    var datetime = new Date(Date.parse($(this).find('pubDate').text()));
    item['timestamp'] = datetime.getTime();
    item['title'] = $(this).find("title").text();
    item['readed'] = false;
    item['content'] = $(this).find("description").text();
    item['media_url'] = $(this).find("enclosure").attr('url');
    console.log(item)
    items.push(item);

    appendHtml += "<li data-role='list-divider'>"+$(this).find("pubDate").text()+"<span class='ui-li-count'>1</span></li>" +
                  "<li>" +
                    "<a href='index.html'>" +
                      "<h2>"+$(this).find("title").text()+"</h2>" +
                    "</a>"
                  "</li>";

  });

  $divchannels.html(appendHtml);

  save_feed(url, items);
}


function fetchItemAsHTML(item){
  // console.log(item);
  var returnHtml = "<li>";

  var title = "";
  var link = "";
  var pubDate = "";

  title = item.find("title").text() + "<br>";
  link = item.find("link").text() + "<br>";
  pudDate = item.find("pubDate").text() + "<br>";

  // console.log(title);
  // console.log(link);
  // console.log(pubDate);


  returnHtml += title;
  returnHtml += link;
  returnHtml += pubDate;

  returnHtml += "</li>";

  console.log(returnHtml);

  return returnHtml;
}

function save_feed(url, items) {
  var urls = [
              {
                feed_url:url, 
                items: items
              }
             ];

  chrome.storage.local.set({'feeds': urls}, function() {
    message('URLs saved');
  });
}

function get_urls() {
  chrome.storage.local.get('feeds', function(feed_items) {

    $.each(feed_items['feeds'], function(index, item) {
      if(item['items'].length > 0) {
        $.each(item['items'], function(index, item) {
          if (item['readed'] == false) {
            $('#unread ul').append('<li><a href="#show_feed_'+item['timestamp']+'" class="show_feed">'+item['title']+'</a></li>');
            $('body').append('<div data-role="page" id="show_feed_'+item['timestamp']+'" data-theme="a">'+
                              +'<div data-role="header">'+
                                +'<div data-role="navbar">'+
                                  +'<ul>'+
                                    +'<li><a href="#settings_page">Settings</a></li>'+
                                    +'<li><a href="#show_all_page">Show All</a></li>'+
                                    +'<li><a href="#show_starred_page">Show Starred</a></li>'+
                                    +'<li><a href="#show_unread">Show Unread</a></li>'+
                                    +'<li><a href="#show_feed">Add Feed</a></li>'+
                                  +'</ul>'+
                                +'</div>'+
                              +'</div>'+
                              +'<div data-role="content">'+item['content']+' -------- '+item['media_url']+'</div>'+
                            +'</div>');
          }
        })
      }
    })

  });
}

function show_content(content, media_url) {
  message('---')
  message(content)
  $('#feed_content').html(content + "------" + media_url);
}

