$.ajax({
  type: 'GET',
  dataType: 'jsonp',
  url: 'https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=norfolkjs&photo-host=public&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=81917392&sig=fb1e9faa799ccb48535114e0f1f92e002383f8c7',
  data: {}
})

.done(
  function (json) {

    /** API documentation findable here
      http://www.meetup.com/meetup_api/docs/2/events/
    **/
    $.each(json.results, function (key, val) {
      var name, info, description, date, rsvp, container, venue;
      moment.lang("en");
      date = moment(val.time).format(" h:mma on dddd, MMMM Do");
        console.log($.trim(val.name));
        name = $.trim(val.name) !== null ? $.trim(val.name) : "Not Yet Set";
        name = $('<h2>', {text: name});

        info = $(val.description).text() !== null ? $(val.description).text() : "No Description";
        info = $.trim(info).substring(0, 400).split(" ").slice(0, -1).join(" ") + "...";
        description = $('<p>', {text: info});

        rsvp = $('<a>', {text: "Join " + val.yes_rsvp_count + " ninjas at " + date, href: val.event_url, target: "_blank"});
        console.log(val.venue );
        venue = typeof(val.venue) !== "undefined" ? val.venue.name : "To Be Announced";
        venue = $('<p>', {html: "Location: " + venue});

        container = $('<div>', {html: name, class: "event"});
        container.append(rsvp);
        container.append(description);
        container.append(venue);
        $(".events").append(container);
    });
});
