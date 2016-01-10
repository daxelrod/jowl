'use strict';

var run = require('./run');

var format = {};

format.parseInput = function(input) {
  return JSON.parse(input);
};

format.formatOutput = function(resultData) {
  return JSON.stringify(resultData, null, 4);
};

format.runFormat = function(json, command) {
  var data = this.parseInput(json);
  var result = run.run(data, command);
  return this.formatOutput(result);
};

module.exports = format;
