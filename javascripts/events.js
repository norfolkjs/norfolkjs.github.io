let MeetupEventProxyUrl = "https://us-central1-stan-zheng.cloudfunctions.net/meetup-proxy"
let imgUrl = '<p><img style="float:left; margin-right:4px" src="https://secure.meetupstatic.com/photos/event/6/5/d/3/event_434126067.jpeg" alt="photo" class="photo" />Norfolk.js</p>'

async function main() {
  try {
    const data = await getData(MeetupEventProxyUrl);
    data.items.map(d => {
      let container = $("<div>", { html: d.title, class: "event" });
      let description = $("<p>", { html: d.content.replace(imgUrl, '') });

      // ["Saturday, July 25 at 10:00 AM", "4", "https://www.meetup.com/NorfolkJS/events/263839092/"]
      var result = d.content.match(/<p>(.*?)<\/p>/g).map(function (val) {
        return val.replace(/<\/?p>/g, '');
      }).slice(-3)
      let date = result[0]
      let yes_rsvp_count = result[1]
      let event_url = result[2]
      let rsvp = $("<a>", {
        text: "Join " + yes_rsvp_count + " ninjas at " + date,
        href: event_url,
        target: "_blank"
      });
      container.append(description);
      container.append(rsvp);
      $(".events").append(container);
    })
  } catch (err) {
    console.error(err);
  }
}


async function getData(url = '') {
  const response = await fetch(url);
  return await response.json(); // parses JSON response into native JavaScript objects
}

main()