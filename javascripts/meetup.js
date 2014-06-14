$('#container').load('http://google.com');
$.getJSON( "http://corsproxy.com/api.meetup.com/2/groups?radius=25.0&order=id&group_urlname=NorfolkJS&desc=false&offset=0&format=json&page=20&fields=sponsors&sig_id=81917392&sig=3396eb551be275beafd7b16dddeea6553570eb83", function( data ) {
  var items = [];
  console.log(data);
  $.each( data, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val + "</li>" );
  });

  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "body" );
});
