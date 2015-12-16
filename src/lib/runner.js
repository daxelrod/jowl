'use strict';

var _ = require('lodash'); // jshint unused: false

var runner = {};

runner.run = function(data, command) {
  var d = data;

  // Having JSHint ignore this line because evil: false doesn't appear to work
  return eval('_.chain(d).' + command).value(); // jshint ignore: line
};

runner.runJson = function(json, command, options) {
  var data = JSON.parse(json);
  var result = this.run(data, command, options);
  return JSON.stringify(result, null, 4);
};

module.exports = runner;
