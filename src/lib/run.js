'use strict';

var _ = require('lodash');
var vm = require('vm');
require('console.json'); // Injects itself directly into the console object

var run = {};

function p() {
  // console.json can take an unlimited number of arguments
  console.json.apply(console, arguments); // returns undefined

  // can't return more than one value; the first is least surprising
  return arguments[0];
}

run.run = function (data, command) {
  // Parens are needed to disambiguate that curly braces are an object and
  // not a block.
  var script = new vm.Script('(' + command + ')', {
    filename: 'command',
  });

  return script.runInNewContext({
    _: _,
    d: data,
    c: _.chain(data),
    p: p,
  });
};

module.exports = run;
