'use strict';

var run = require('./run');

var format = {};

format.parseInput = function(input) {
  return JSON.parse(input);
};

format.runFormat = function(json, command) {
  var data = this.parseInput(json);
  var result = run.run(data, command);
  return JSON.stringify(result, null, 4);
};

module.exports = format;
