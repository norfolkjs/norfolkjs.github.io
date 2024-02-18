[![Build & Deploy](https://github.com/iambriansreed/norfolkjs.github.io/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/iambriansreed/norfolkjs.github.io/actions/workflows/build-deploy.yml)

# Norfolk.js Website

This repository contains the source code for Norfolk.js's user group website. We strongly encourage everyone
to contribute as much or little as they wish. Not a developer? We can use documentation and design help as well!

This website is built using [handlebars](https://handlebarsjs.com/) and some custom js to build a static website. This site is hosted using [GitHub Pages](https://pages.github.com) on Github.

# Contributing

## How can I help?

Check out the open [bugs and enhancements](https://github.com/norfolkjs/norfolkjs.github.io/issues?state=open).

## How do I get started?

-   [Fork](https://github.com/norfolkjs/fork) this repository. [How?](https://help.github.com/articles/fork-a-repo)
-   Clone your fork. [How?](https://help.github.com/articles/fork-a-repo#step-2-clone-your-fork)
-   Start coding.
-   Push your code to your fork. [How?](https://help.github.com/articles/fork-a-repo#push-commits)
-   Add your name to the [people.txt](/content/about/people.txt).
-   Issue a pull request to [norfolkjs.github.io](https://github.com/norfolkjs/norfolkjs.github.io/pulls). [How?](https://help.github.com/articles/using-pull-requests)

### Local development setup

#### Install the http-server tool

`npm install -g http-server nodemon`
`npm install`

#### Run in development mode

`npm run dev`

Development mode serves the site on the fly, generating pages on the fly.

Then, you can access the site locally by going to https://localhost:4000 in your web browser.

#### Build the static site in the build folder

`npm run build`

Builds a static copy of the site in the build directory.

#### Deploy the build folder and contents to the `gh-pages` branch and push updates

`npm run deploy`

TODO: Run this in a github action when a PR is merged.

## Project structure

The repo has four folders:

-   [/content](#content)
-   [/static](#static)
-   [/templates](#templates)
-   [/src](#src)

### /static

Contains static files. e.g. images, js, css, etc. Assets in this directory will be served at root path / during dev, and copied to the root of the build directory as-is.

### /templates

Contains the [handlebars.js](https://handlebarsjs.com/guide/#what-is-handlebars) templates.

### /src

Contains the server side javascript that builds the website and runs the site in dev mode.

### /content

Contains the files for which pages are built from. The directory structure in this folder directly results in the site structure. Can include the html, [handlebars.js](https://handlebarsjs.com/guide/#what-is-handlebars) templates, markdown, or txt files.

For example:

| Content File Path    | Browser URL Path   | Static File Path Builds       |
| -------------------- | ------------------ | ----------------------------- |
| `index.html`         | `/`                | `/index.html`                 |
| `blog/index.html`    | `/blog`            | `/blog/index.html`            |
| `blog/post-title.md` | `/blog/post-title` | `/blog/post-title/index.html` |
| `about/index.html`   | `/about`           | `/about/index.html`           |
| `about/people.txt`   | `/about/people`    | `/about/people/index.html`    |

#### Meta Header

Content files may optionally contain a meta header. Started with [jekyllrb](https://jekyllrb.com/docs/front-matter/) with some customizations.

```
---
template: post
title: Norfolk.js meetup kickoff
tags: javascript, meetup, norfolk
published: true
excerpt: The kickoff meetup for the Norfolk.js group.
---
```

The only properties that the site builder uses are the `title` property and the `template` property. The `title` property sets the document title. If the `template` prop isn't set the default [template](#templates) is used. All the values in the header can be used in the handlebars templates.
