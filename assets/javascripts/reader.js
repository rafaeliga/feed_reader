$(function() {
  console.log('READER START');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', "feed_itunes.xml", true);
  xhr.onload = function(e) {

      var xml = this.response;
      xmlDoc = $.parseXML( xml );
      $xml = $( xmlDoc );

      $channel = $xml.find( "channel" )

      $divchannels = $("#channels");

      var appendHtml;

      $channel.find("item").each( function(){
        appendHtml += $(this).find("title").text() + "<br><br>";
      });
      $divchannels.html(appendHtml);

  };

  xhr.send();

  search();
});

function search() {
  var term = $('#term').val();

  $.ajax({
    type: 'GET',
    url: term,
    success: function(data, textStatus, request){
      var content_type = request.getResponseHeader('Content-Type');
      console.log(content_type)
      
      if (content_type.match(/text\/html/)) {
        console.log('HTML -> FIND RSS URL');
        var link_rss = $(data).filter("link[type='application/rss+xml']");
        var rss_link = link_rss.attr('href');
        console.log(rss_link)
      } else if (content_type.match(/xml/)) {
        console.log('XML -> PARSE');
        console.log(data)
      }
    },
    error: function (request, textStatus, errorThrown) {
      console.log(request.getResponseHeader('Content-Type'));
      console.log('f')
    }
  });
}