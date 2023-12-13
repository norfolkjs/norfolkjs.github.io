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

Generates all the [`/content``](#content) files as static files.
Copies all the static files to the build folder.

| Content File Path               | URL Path                      |
| ------------------------------- | ----------------------------- |
| `index.html`                    | `/`                           |
| `blog/index.html`               | `/blog`                       |
| `blog/2023-12-25-post-title.md` | `/blog/2023-12-25-post-title` |
| `about/index.html`              | `/about`                      |
| `about/people.txt`              | `/about/people`               |

#### Deploy the build folder and contents to the gh-pages branch and push updates

`npm run deploy`

TODO: Run this in a github action when a PR is merged.

## File structure

The repo has four folders:

-   [/content](#content)
-   [/static](#static)
-   [/templates](#templates)
-   [/src](#src)

### /static

Contains the client side static files. e.g. images, client side js, css, etc. The contents of this folder are included in the build of the site.

### /content

Contains the html, [handlebars.js](https://handlebarsjs.com/guide/#what-is-handlebars) templates, markdown, or txt files with the content of the site.

#### Meta

Content files may also contain a meta header. The `title` property sets the document title. If the `template` prop isn't set the default [template](#templates) is used. All the values in the header can be used in the handlebars templates.

```
---
template: post
title: Norfolk.js meetup kickoff
tags: javascript, meetup, norfolk
published: true
excerpt: The kickoff meetup for the Norfolk.js group.
---
```

### /templates

Contains the [handlebars.js](https://handlebarsjs.com/guide/#what-is-handlebars) templates.

### /src

Contains the server side javascript that builds the website and runs the site in dev mode.

###
