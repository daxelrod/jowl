'use strict';

var _ = require('lodash'); // jshint unused: false

var runner = {};

runner.run = function(data, command, options) {
  var prefix;
  var suffix;

  if (options.chain) {
    prefix = '_.chain(d).';
    suffix = '';
  } else {
    // Parens are needed to disambiguate that curly braces are an object and
    // not a block.
    prefix = '(';
    suffix = ')';
  }

  var d = data;

  // Having JSHint ignore this line because evil: false doesn't appear to work
  var result = eval(prefix + command + suffix); // jshint ignore: line

  return options.chain ? result.value() : result;
};

runner.runJson = function(json, command, options) {
  var data = JSON.parse(json);
  var result = this.run(data, command, options);
  return JSON.stringify(result, null, 4);
};

module.exports = runner;
