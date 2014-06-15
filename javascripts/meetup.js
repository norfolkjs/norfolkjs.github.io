var foo = $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/groups',
    data: {
        key: '5f2a61211f8735c1f612b661c263a18',
        group_urlname: 'NorfolkJS',
        fields: 'sponsors',
        sig_id: true,
    }
})
.done(function (json) {
    console.log(json);
      var items = [];
  $.each( json.results[0].sponsors, function( key, val ) {
    console.log(key);
    console.log(val);
    //items.push( "<li id='" + key + "'>" + val + "</li>" );
    if(!val.hasOwnProperty("redeem")){
      items.push( "<a href='" + val.url + "'>" + "<img src='" + val.image_url + "'>" + "</a>" );
    }
  });

  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "#sponsors" );

});
