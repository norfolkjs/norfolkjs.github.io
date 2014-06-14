// var url = "http://api.meetup.com/2/groups?key=5f2a61211f8735c1f612b661c263a18&radius=25.0&order=id&group_urlname=NorfolkJS&desc=false&offset=0&format=json&page=20&fields=sponsors&sig_id=81917392&sig=3396eb551be275beafd7b16dddeea6553570eb83";
// // $.getJSON( url, function( data ) {
// //   var items = [];
// //   console.log(JSON.parse(data));
// //
// //   // $.each( data, function( key, val ) {
// //   //   items.push( "<li id='" + key + "'>" + val + "</li>" );
// //   // });
// //   //
// //   // $( "<ul/>", {
// //   //   "class": "my-new-list",
// //   //   html: items.join( "" )
// //   // }).appendTo( "body" );
// // });
//
// $(document).ready(function(){
// $.getJSON(url, displayGroups);
//
// function displayGroups(data) {
//     console.log(data);
//     var htmlString = "";
//     $.each(data.items, function (i, item) {
//         htmlString += '<h3><a href="' + item.link + '" target="_blank">' + item.name + '</a></h3>';
//     });
//     $('#groups').html(htmlString);
// }
// });
var foo = $.getJSON(
 'http://api.meetup.com/2/groups?key=5f2a61211f8735c1f612b661c263a18&group_urlname=NorfolkJS&fields=sponsors&sig_id=true?callback=getJSON',
 function(data) { console.log(data); }
);
