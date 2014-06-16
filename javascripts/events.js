$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=Norfolkjs&desc=false&offset=0&format=json&page=200&fields=&sig_id=81917392&sig=930ab80837bf42d66ba5a2e155c3d2b9347d4227',
    data: {
    }
})
    .done(
      function (json) {
        console.log(json);
        $.each(json.results, function (key,val) {
            var name = $('<a>', {href: val.event_url, html: $('<h3>', {text: val.name})});
            var info = $(val.description).text();
            info = jQuery.trim(info).substring(0, 250).split(" ").slice(0, -1).join(" ") + "...";
            var description = $('<p>', {text: info});
            moment.lang("en");
            var date = moment(val.time).format(" h:mma on dddd, MMMM Do");
            var rsvp = $('<h2>', {text: "Join " + val.yes_rsvp_count + " ninjas at " + date});
            var container = $('<div>', {html:name, class: "event"});
            container.append(rsvp);
            container.append(description);
            $(".events").append(container);
        });
    });
