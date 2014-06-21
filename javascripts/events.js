$.ajax({
  type: 'GET',
  dataType: 'jsonp',
  url: 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=norfolkjs&desc=false&offset=0&format=json&page=20&fields=&sig_id=81917392&sig=f73e25d2afbe77cec29ac349a9fc5744b7a77d69',
  data: {}
})

.done(
  function (json) {

    /** API documentation findable here
      http://www.meetup.com/meetup_api/docs/2/events/
    **/
    $.each(json.results, function (key, val) {
      var name, info, description, date, rsvp, container;
      moment.lang("en");
      date = moment(val.time).format(" h:mma on dddd, MMMM Do");

      name = $.trim(val.name);
      name = $('<a>', {href: val.event_url, target: "_blank", html: $('<h2>', {text: name})});

      info = $(val.description).text();
      info = $.trim(info).substring(0, 400).split(" ").slice(0, -1).join(" ") + "...";

      description = $('<p>', {text: info});

      rsvp = $('<p>', {text: "Join " + val.yes_rsvp_count + " ninjas at " + date});
      name.append(rsvp);

      container = $('<div>', {html:name, class: "event"});
      container.append(description);
      $(".events").append(container);
    });
});
