<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">

    <link rel="author" href="humans.txt" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/stylesheet.css" media="screen" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/pygment_trac.css" media="screen" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/ribbon.css" media="screen" />

    <title>Unofficial US (east) mirror for Npm</title>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="https://rawgit.com/moment/moment/develop/min/moment.min.js"></script>

    <link rel="apple-touch-icon-precomposed" href="apple-touch-icon-152x152-precomposed.png" />
    <link rel="icon" href="favicon-096.png" />
    <!--[if IE]><link rel="shortcut icon" href="favicon.ico" /><![endif]-->
    <meta name="msapplication-TileColor" content="#fcda3e" />
    <meta name="msapplication-TileImage" content="favicon-144-trans.png" />

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-49239066-1', 'norfolkjs.org');
      ga('send', 'pageview');
    </script>
  </head>

  <body>

<span id="forkongithub"><a href="https://github.com/norfolkjs/norfolkjs.github.io">Fork me on GitHub</a></span>
<header>
  <div class="container">
    <a href="/index.html"><img src="/images/ninjacat_150.png"></a>
    <h1>Norfolk.js</h1>
    <h2>JavaScript User Group in Norfolk, VA</h2>
    <a href="/about/index.html">About Us</a>
    <a href="/index.html">Events</a>
    <a href="/blog/index.html">Blog</a>
    <a href="/sponsors/index.html">Sponsors</a>
    <a href="/nodebots/index.html">NodeBots</a>
    <a href="/contact/index.html">Contact Us</a>
  </div>
</header>


<div class="container">
  <section id="main_content">
    <h2>Unofficial US (east) mirror for Npm</h2>
<p><p><a href="https://github.com/norfolkjs/npmjs.us">https://github.com/norfolkjs/npmjs.us</a></p>

<p>This is an unofficial, but pretty good US (east) mirror for npm;
this service is sponsored and maintained by Norfolk.js</p>

<p>Modus Operandi</p>

<p>We continuously replicate the official npmjs database.
It is large (>200GB) so updates to public npm modules may take some minutes to show up in our registry.</p>

<p>The public database is read-only, so do not try to publish to it.
In the event of failure to resolve a module, the server will failover to the official npm service.
This service is SSL-secured and monitored.</p>

<p>Using this service:</p>

<p>Option 1: Add this registry to your .npmrc. e.g. registry =https://registry.npmjs.us/public</p>

<p>Option 2: Set the registry config via npm: npm config set registry=https://registry.npmjs.us/public</p>

<p>Option 3: Add it as a command-line argument: npm install module --registry https://registry.npmjs.us/public</p></p>
  </section>
</div>

<footer>
  <h2>Norfolk.js &copy; <span id="copyright_year">2019</span> all rights reserved.</h2>
  <h2>Brought to you by <a href="/humans.txt">proud ninjas</a>.</h2>
</footer>

<script>
$('#copyright_year').html(new Date().getFullYear());
</script>

  </body>
</html>
