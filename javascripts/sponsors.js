$.ajax({
  type: "GET",
  dataType: "jsonp",
  url: "https://api.meetup.com/2/groups?offset=0&format=json&group_urlname=norfolkjs&photo-host=public&page=20&radius=25.0&fields=sponsors&order=id&desc=false&sig_id=215788584&sig=be25f93d13098f6075992b9f461ae6db7c7fe9a1",
  data: {}
}).done(function(json) {
  //add class, set height, width is auto
  $.each(json.results[0].sponsors, function(key, val) {
    var image;
    if (!val.hasOwnProperty("redeem")) {
      image = $("<a>", {
        href: val.url,
        html: $("<img>", { src: val.image_url, alt: val.name })
      });
      $(".sponsors").append(image);
    }
  });
});
