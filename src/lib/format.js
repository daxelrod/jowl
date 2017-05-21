const _ = require('lodash');

const run = require('./run');

const format = {};

format.parseInput = function parseInput(input) {
  return JSON.parse(input);
};

format.formatOutput = function formatOutput(resultData) {
  return JSON.stringify(resultData, null, 4);
};

// Returns either a string to be output, or null if output should be supressed
format.runFormat = function runFormat(json, command, options) {
  const data = this.parseInput(json);
  const result = run.run(data, command);

  // Need to unconditionally stringify because _.chain is lazy and
  // we need p() output even in quiet mode
  const output = this.formatOutput(result);

  // options might be undefined if called from tests
  return _.get(options, 'quiet') ? null : output;
};

module.exports = format;
