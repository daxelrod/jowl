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

  return script.runInNewContext({
    _: _,
    d: data,
    c: _.chain(data),
  });
};

module.exports = run;
