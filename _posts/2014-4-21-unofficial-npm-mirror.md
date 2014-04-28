---
layout: post
title: Unofficial US (east) mirror for Npm
tags: javascript, npm, norfolk, mirror
published: true
excerpt: This is an unofficial, but pretty good US (east) mirror for npm; this service is sponsored and maintained by norfolkjs.org.
---

<p><a href="https://github.com/norfolkjs/npmjs.us">https://github.com/norfolkjs/npmjs.us</a></p>

<p>This is an unofficial, but pretty good US (east) mirror for npm;
this service is sponsored and maintained by norfolkjs.org.</p>

<p>Modus Operandi</p>

<p>We continuously replicate the official npmjs database.
It is large (>200GB) so updates to public npm modules may take some minutes to show up in our registry.</p>

<p>The public database is read-only, so do not try to publish to it.
In the event of failure to resolve a module, the server will failover to the official npm service.
This service is SSL-secured and monitored.</p>

<p>Using this service:</p>

<p>Option 1: Add this registry to your .npmrc. e.g. registry =https://registry.npmjs.us/public</p>

<p>Option 2: Set the registry config via npm: npm config set registry=https://registry.npmjs.us/public</p>

<p>Option 3: Add it as a command-line argument: npm install module --registry https://registry.npmjs.us/public</p>
