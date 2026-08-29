#!/usr/bin/env node
/*
 * Fetches upcoming Norfolk.js events from Meetup and writes _includes/events.html,
 * which index.html pulls in at build time.
 *
 * This runs on the build machine, not in the browser, which matters for two reasons:
 * Meetup's RSS feed sends no CORS headers (hence the old cloud-function proxy), and
 * the feed itself no longer carries the event date -- that only lives in the JSON-LD
 * on each event page, which is far too heavy to fetch client-side.
 *
 * Failure is soft on purpose: if Meetup is unreachable or returns something we can't
 * parse, we leave the previously generated file in place so a build during an outage
 * republishes the last known good list rather than an empty events page.
 */

const fs = require("fs");
const path = require("path");

const FEED_URL = "https://www.meetup.com/NorfolkJS/events/rss/";
const EVENTS_URL = "https://www.meetup.com/NorfolkJS/events/";
const OUT_FILE = path.join(__dirname, "..", "_includes", "events.html");
const UA = "norfolkjs.com site build (+https://github.com/norfolkjs/norfolkjs.github.io)";
const TIMEOUT_MS = 20000;

async function get(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

// --- tiny RSS reader -------------------------------------------------------
// The feed is a flat, single-generator RSS 2.0 document, so pulling the four
// fields we need out of each <item> beats taking on an XML dependency.

function unwrap(value) {
  const cdata = value.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  if (cdata) return cdata[1];
  return value
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#3?9;/g, "'")
    .replace(/&amp;/g, "&");
}

function field(itemXml, name) {
  const m = itemXml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? unwrap(m[1]).trim() : "";
}

function parseFeed(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => ({
    title: field(m[1], "title"),
    link: field(m[1], "link") || field(m[1], "guid"),
    description: field(m[1], "description"),
  })).filter(e => e.title && e.link);
}

// --- event date, from the event page's schema.org markup -------------------

function parseEventPage(html) {
  const blocks = [...html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )];
  for (const [, raw] of blocks) {
    let data;
    try { data = JSON.parse(raw); } catch { continue; }
    for (const node of Array.isArray(data) ? data : [data]) {
      if (node && node["@type"] === "Event" && node.startDate) {
        const loc = node.location;
        return {
          startDate: node.startDate,
          venue: (loc && typeof loc === "object" ? loc.name : loc) || "",
        };
      }
    }
  }
  return null;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

// startDate carries its own UTC offset (e.g. 2026-08-31T18:30:00-04:00). Read the
// wall-clock fields straight off the string so the time we print is the time local
// to the event, whatever timezone the build machine happens to be in.
function formatDate(iso) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return "";
  const [, y, mo, d, hh, mm] = m.map(Number);
  const weekday = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  const suffix = hh < 12 ? "AM" : "PM";
  const minutes = mm === 0 ? "" : `:${String(mm).padStart(2, "0")}`;
  return `${weekday}, ${MONTHS[mo - 1]} ${d} at ${hour12}${minutes} ${suffix}`;
}

// --- rendering -------------------------------------------------------------

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function safeUrl(href) {
  if (/^(https?:\/\/|mailto:|\/)/i.test(href)) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null; // javascript:, data:, etc.
  return "https://" + href;
}

// Meetup hands us plain markdown, so render the inline bits people actually use.
function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (match, label, href) => {
      const url = safeUrl(href);
      return url ? `<a href="${url}">${label}</a>` : label;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function renderDescription(text) {
  return text.trim().split(/\n{2,}/)
    .filter(Boolean)
    .map(block => `    <p>${inlineMarkdown(block)}</p>`)
    .join("\n");
}

function renderEvent(e) {
  const parts = [`  <div class="event">`, `    <h3>${escapeHtml(e.title)}</h3>`];
  if (e.startDate) {
    const when = formatDate(e.startDate);
    const where = e.venue ? ` at ${escapeHtml(e.venue)}` : "";
    parts.push(`    <p class="event-when"><time datetime="${escapeHtml(e.startDate)}">${escapeHtml(when)}</time>${where}</p>`);
  }
  if (e.description) parts.push(renderDescription(e.description));
  parts.push(`    <a href="${escapeHtml(e.link)}">Join the ninjas on Meetup</a>`);
  parts.push(`  </div>`);
  return parts.join("\n");
}

function render(events) {
  const stamp = new Date().toISOString();
  const body = events.length
    ? events.map(renderEvent).join("\n")
    : `  <p>No upcoming events posted right now.</p>\n` +
      `  <a href="${EVENTS_URL}">See what's next on Meetup</a>`;
  return `<!-- Generated by scripts/fetch-events.js on ${stamp}. Do not edit by hand. -->\n` +
         `<div class="events">\n${body}\n</div>\n`;
}

// --- main ------------------------------------------------------------------

async function main() {
  const feed = parseFeed(await get(FEED_URL));
  if (!feed.length) throw new Error("no <item> entries parsed from the feed");

  const events = await Promise.all(feed.map(async e => {
    try {
      const detail = parseEventPage(await get(e.link));
      if (detail) return { ...e, ...detail };
      console.warn(`  no JSON-LD event date found for ${e.link}`);
    } catch (err) {
      console.warn(`  could not read ${e.link}: ${err.message}`);
    }
    return e; // title, description and link are still worth publishing
  }));

  events.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, render(events));
  console.log(`  wrote ${path.relative(process.cwd(), OUT_FILE)} with ${events.length} event(s):`);
  for (const e of events) {
    console.log(`    - ${e.title}${e.startDate ? ` (${formatDate(e.startDate)})` : " (no date)"}`);
  }
}

main().catch(err => {
  console.warn(`\n  Could not refresh events from Meetup: ${err.message}`);
  if (fs.existsSync(OUT_FILE)) {
    console.warn("  Keeping the previously generated _includes/events.html.\n");
  } else {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, render([]));
    console.warn("  Wrote a placeholder events page.\n");
  }
  // Soft failure: never break the build over an upstream outage.
});
