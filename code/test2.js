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