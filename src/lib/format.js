'use strict';

var _ = require('lodash');

var run = require('./run');

var format = {};

format.parseInput = function (input) {
  return JSON.parse(input);
};

format.formatOutput = function (resultData) {
  return JSON.stringify(resultData, null, 4);
};

// Returns either a string to be output, or null if output should be supressed
format.runFormat = function (json, command, options) {
  var data = this.parseInput(json);
  var result = run.run(data, command);

  // Need to unconditionally stringify because _.chain is lazy and
  // we need p() output even in quiet mode
  var output = this.formatOutput(result);

  // options might be undefined if called from tests
  return _.get(options, 'quiet') ? null : output;
};

module.exports = format;
