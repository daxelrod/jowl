const _ = require('lodash');
const colorize = require('json-colorizer');
const chalk = require('chalk');
const run = require('./run');

const format = {};

// Make json-colorizer's single exported function a method
// so that we can hook it in unit tests. This is ugly,
// but is more straightforward than another dependency
// that redefines how require() works.
format.jsonColorizer = colorize;

format.parseInput = function parseInput(input) {
  return JSON.parse(input);
};

format.formatOutput = function formatOutput(resultData) {
  // For now, disable syntax coloring
  chalk.level = 0;

  // We must stringify the JSON ourselves before passing it
  // to json-colorizer because we may be serializing a single
  // string, which json-colorizer would try to parse as json
  return this.jsonColorizer(JSON.stringify(resultData, null, 2), {});
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
