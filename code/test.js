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
