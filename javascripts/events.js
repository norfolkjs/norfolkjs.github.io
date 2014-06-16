$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/events',
    data: {
        key: '5f2a61211f8735c1f612b661c263a18',
        group_urlname: 'NorfolkJS',
        sig_id: true
    }
})
    .done(
      function (json) {
        console.log(json);
        $.each(json.results, function (key,val) {
            var name = $('<a>', {href: val.event_url, html: $('<h2>', {text: val.name})});
            var info = $(val.description).text();
            info = jQuery.trim(info).substring(0, 200).split(" ").slice(0, -1).join(" ") + "...";
            var description = $('<p>', {text: info});
            var container = $('<div>', {html:name, class: "event"});
            container.append(description);
            $(".events").append(container);
        });
    });
