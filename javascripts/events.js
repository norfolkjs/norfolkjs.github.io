let MeetupEventProxyUrl = "https://us-central1-stan-zheng.cloudfunctions.net/meetup-proxy"
let MeetupEventsUrl = "https://www.meetup.com/NorfolkJS/events/"

async function main() {
  const events = $(".events");
  try {
    const data = await getData(MeetupEventProxyUrl);
    const items = (data && data.items) || [];

    if (!items.length) {
      events.append($("<p>", { text: "No upcoming events posted right now." }));
      events.append(meetupLink("See what's next on Meetup"));
      return;
    }

    items.forEach(d => {
      const container = $("<div>", { class: "event" });
      container.append($("<h3>", { text: d.title || "Upcoming event" }));

      description(d.content || d.contentSnippet || "").forEach(p => container.append(p));

      const url = d.link || d.guid;
      if (url) {
        container.append($("<a>", {
          text: "Join the ninjas on Meetup",
          href: url,
          target: "_blank",
          rel: "noopener"
        }));
      }

      events.append(container);
    });
  } catch (err) {
    console.error("Could not load Meetup events:", err);
    events.append($("<p>", { text: "We couldn't load our events right now." }));
    events.append(meetupLink("See upcoming events on Meetup"));
  }
}

function meetupLink(text) {
  return $("<a>", { text: text, href: MeetupEventsUrl, target: "_blank", rel: "noopener" });
}

// Meetup's feed hands us plain markdown, so split it into paragraphs and
// render just the inline bits people actually use in event descriptions.
function description(text) {
  return text.trim().split(/\n{2,}/).map(block => $("<p>", { html: inlineMarkdown(block) }));
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (match, label, href) => {
      const url = safeUrl(href);
      return url ? '<a href="' + url + '" target="_blank" rel="noopener">' + label + "</a>" : label;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function safeUrl(href) {
  if (/^(https?:\/\/|mailto:|\/)/i.test(href)) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null; // javascript:, data:, etc.
  return "https://" + href;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function getData(url = '') {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Meetup proxy returned " + response.status);
  return await response.json(); // parses JSON response into native JavaScript objects
}

// The .events container is further down the page than this script tag, so wait
// for ready. Keep the wrapper a plain function rather than passing main directly:
// older jQuery treats an async function as [object AsyncFunction], not a function,
// and silently never fires it.
$(function () {
  main();
});
