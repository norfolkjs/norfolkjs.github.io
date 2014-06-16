$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/events',
    data: {
        key: '5f2a61211f8735c1f612b661c263a18',
        group_urlname: 'NorfolkJS',
        fields: 'sponsors',
        sig_id: true
    }
})
    .done(
      function (json) {
        console.log(json);
        $.each(json.results, function (key,val) {
            var element = $('<a>', {href: val.event_url, html: $('<h2>', {text: val.name})});
            var container = $('<div>',{html:element, class: "event"});
            console.log(element);
            $(".events").append(container);
        });
    });
