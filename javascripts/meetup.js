$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/groups',
    data: {
        key: '1f5c35a1603866a50862ee2379',
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
