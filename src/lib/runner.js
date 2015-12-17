'use strict';

var _ = require('lodash');
var vm = require('vm');

var runner = {};

runner.run = function(data, command, options) {
  var prefix;
  var suffix;

  if (options.chain) {
    prefix = 'c.';
    suffix = '';
  } else {
    // Parens are needed to disambiguate that curly braces are an object and
    // not a block.
    prefix = '(';
    suffix = ')';
  }

  var script = new vm.Script(prefix + command + suffix, {
    filename: 'command',
  });

  var result = script.runInNewContext({
    _: _,
    d: data,
    c: _.chain(data),
  });

  return options.chain ? result.value() : result;
};

runner.runJson = function(json, command, options) {
  var data = JSON.parse(json);
  var result = this.run(data, command, options);
  return JSON.stringify(result, null, 4);
};

module.exports = runner;
