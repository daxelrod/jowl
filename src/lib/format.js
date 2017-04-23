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

  // options might be undefined if called from tests
  var output = _.get(options, 'quiet') ? null : this.formatOutput(result);

  return output;
};

module.exports = format;
