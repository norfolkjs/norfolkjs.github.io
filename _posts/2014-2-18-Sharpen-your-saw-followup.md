---
layout: post
title: Sharpen Your Saw Follow-up
tags: javascript, meetup, norfolk
published: true
---

Here is a summary of the topics covered by the Monday NorfolkJS Meetup. Steve Shackbarth presented Sharpen your Saw, discussing problem-solving using Javascript and other useful utilities.

Participants were encouraged to bring laptops to participate in code exercises.
+ Participants could use <a href="http://jsfiddle.net">jsfiddle.net</a>
+ Some of the utilities used were underscore.js and mocha.js tests.

Two Exercises Discussed
+ Write a function that determines if a word is a left hand word. A left hand word is delimited by the divide between 'y h n' on the keyboard.
+ Write a function that determines the longest word creatable with just left handed letters.

<p>The following video was shot using Google Glass; it is cut up into 3 primary segments</p>
<a href="#">-Coming Soon...-</a>


```javascript
/* prompt one */
var _ = require("underscore"),
  assert = require("chai").assert;

function isLeftHanded(w) {
  var h=['q','w','e','r','t','a','s','d','f','z','x','c','v'],
    s=w.toLowerCase().split(''),
    x=1;

  _.each(s,function (l){
    if (!_.contains(h,l)) {
      x=0;
    }
  });
  return 1==x;
}

var isLeftyRobert = function (s) {
  return _.every(s.toLowerCase(),function (i) {
    return !!({a:1,b:1,c:1,d:1,e:1,f:1,g:1,q:1,r:1,s:1,t:1,v:1,w:1,x:1,z:1}[i]);

  });
};

var isLeftHanded = function (s) {
  return _.contains(["qwed", "QDW"], s);
};

var isLeftHandedKevin = function (s) {
  return _.every(s.toLowerCase(), function (l) {
    return _.contains(['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'], l);
  });
};

var isLeftHandedTravis = function (str) {
  var i = 0,
    rh = 'ygbuhnijmoklp';

  for (c in rh)
    for (d in str)
      (rh[c] === str[d]) && i++;

  return !(i > 0);
};



describe("The left-handed predicate function", function () {
  it("should return true if the word can be typed with the left hand in qwerty", function () {
    assert.isTrue(isLeftHandedKevin("qwed"));
    assert.isTrue(isLeftHandedKevin("QDW"));
    assert.isFalse(isLeftHandedKevin("okok"));
    assert.isFalse(isLeftHandedKevin("GOO"));
  });
});
```

<p> Second Exercise</p>
```javascript
var _ = require("underscore"),
  fs = require("fs");

var isLeftHanded = function (s) {
  return _.every(s.toLowerCase(), function (l) {
    return _.contains('qwertasdfgzxcvb', l);
  });
};

fs.readFile("/usr/share/dict/words", "utf8", function (err, contents) {
  var words = contents.split("\n");
  var leftHandedWords = _.filter(words, isLeftHanded);
  var sortedWords = _.sortBy(leftHandedWords, function (word) {
    return -1 * word.length;
  });
  console.log(sortedWords[0]);
});
```
<p>
Be sure to join us Next Month for BeerJS
</p>
