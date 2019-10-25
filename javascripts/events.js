let MeetupEventProxyUrl = "https://us-central1-stan-zheng.cloudfunctions.net/meetup-proxy"

async function main(){
  try {
    const data = await getData(MeetupEventProxyUrl);
    data.items.map(d=>{
      let container = $("<div>", { html: d.title, class: "event" });
      let description = $("<p>", { html: d.content });
      container.append(description);
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