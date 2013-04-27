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
});

function search() {
  $term = $('#term').val();


  console.log($term)
}