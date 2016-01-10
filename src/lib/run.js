'use strict';

var _ = require('lodash');
var vm = require('vm');

var run = {};

run.run = function(data, command) {
  // Parens are needed to disambiguate that curly braces are an object and
  // not a block.
  var script = new vm.Script('(' + command + ')', {
    filename: 'command',
  });

  var result = script.runInNewContext({
    _: _,
    d: data,
    c: _.chain(data),
  });

  var value = result;
  if (result != null && result.value === _.prototype.value) {
    // If we have a lodash chain, get its value
    value = result.value();
  }

  return value;
};

module.exports = run;
