'use strict';

var _ = require('lodash');
var vm = require('vm');
require('console.json'); // Injects itself directly into the console object

var run = {};

function p(data) {
  // intentionally limit to just one argument
  console.json(data); // returns undefined
  return data;
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
