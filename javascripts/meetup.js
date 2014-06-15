$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/groups',
    data: {
        key: '5f2a61211f8735c1f612b661c263a18',
        group_urlname: 'NorfolkJS',
        fields: 'sponsors',
        sig_id: true
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
