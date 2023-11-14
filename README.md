Norfolk.js Website
===================

This repository contains the source code for Norfolk.js's user group website. We strongly encourage everyone
to contribute as much or little as they wish. Not a developer? We can use documentation and design help as well!

This website is built using [jekyll](http://jekyllrb.com), a static website and blog generator. This site is hosted using [GitHub Pages](http://pages.github.com) on Github.

# Contributing

## How can I help?

Check out the open [bugs and enhancements](https://github.com/norfolkjs/norfolkjs.github.io/issues?state=open).

## How do I get started?

* [Fork](https://github.com/norfolkjs/fork) this repository. [How?](https://help.github.com/articles/fork-a-repo)
* Clone your fork. [How?](https://help.github.com/articles/fork-a-repo#step-2-clone-your-fork)
* Start coding.
* Push your code to your fork. [How?](https://help.github.com/articles/fork-a-repo#push-commits)
* Add your name to the [humans.txt](https://github.com/norfolkjs/norfolkjs.github.io/blob/master/humans.txt).
* Issue a pull request to [norfolkjs.github.io](https://github.com/norfolkjs/norfolkjs.github.io/pulls). [How?](https://help.github.com/articles/using-pull-requests)

After all things are installed, consult each file in the tasks directory for some development tips. Since we use Bundler bin stubs, make sure to have the local `.bin` folder is high in your `$PATH`. See [rbenv's for recommendations](https://github.com/sstephenson/rbenv/wiki/Understanding-binstubs#adding-project-specific-binstubs-to-path).

## 2023 Update

Local build requirements: Ruby 2.7.2
```
$ rvm install 2.7
$ gem install bundler
$ bundle install
$ bundle exec jekyll serve 
```
Then, you can access the site locally by going to http://localhost:4000 in your web browser.