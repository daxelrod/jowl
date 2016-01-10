'use strict';

var run = require('./run');

var format = {};

format.runJson = function(json, command) {
  var data = JSON.parse(json);
  var result = run.run(data, command);
  return JSON.stringify(result, null, 4);
};

module.exports = format;
