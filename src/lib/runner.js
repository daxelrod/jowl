'use strict';

var _ = require('lodash'); // jshint unused: false

var runner = {};

runner.run = function(data, command) {
  // Having JSHint ignore this line because evil: false doesn't appear to work
  return eval('_.chain(data).' + command).value(); // jshint ignore: line
};

module.exports = runner;
