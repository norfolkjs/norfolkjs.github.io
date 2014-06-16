$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=Norfolkjs&desc=false&offset=0&format=json&page=200&fields=sponsors&sig_id=81917392&sig=054ddc7cf1f8fe97f4801d388e02b94a2dff72b7',
    data: {
    }
})
    .done(function (json) {
        console.log(json);
        //add class, set height, width is auto
        $.each(json.results[0].sponsors, function (key,val) {
            if (!val.hasOwnProperty("redeem")) {
                var element = $('<a>', {href: val.url, html: $('<img>', {src: val.image_url, class: "logo"})});
                $(".sponsors").append(element);
            }
        });
    });
