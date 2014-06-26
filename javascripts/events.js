$.ajax({
  type: 'GET',
  dataType: 'jsonp',
  url: 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=norfolkjs&desc=false&offset=0&format=json&page=20&fields=&time=0%2C2m&sig_id=81917392&sig=919eaebced29b0c42b82ce3be03852353097aee9',
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
      limit = moment().add(2,'months');

        name = $.trim(val.name);
        name = $('<h2>', {text: name});

        info = $(val.description).text();
        info = $.trim(info).substring(0, 400).split(" ").slice(0, -1).join(" ") + "...";

        description = $('<p>', {text: info});

        rsvp = $('<a>', {text: "Join " + val.yes_rsvp_count + " ninjas at " + date, href: val.event_url, target: "_blank"});

        venue = $('<p>', {html: "Location: " + val.venue.name});

        container = $('<div>', {html: name, class: "event"});
        container.append(rsvp);
        container.append(description);
        container.append(venue);
        $(".events").append(container);
    });
});
