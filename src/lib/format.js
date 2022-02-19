const _ = require('lodash');
const colorize = require('json-colorizer');
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
  // We must stringify the JSON ourselves before passing it
  // to json-colorizer because we may be serializing a single
  // string, which json-colorizer would try to parse as json
  return this.jsonColorizer(JSON.stringify(resultData, null, 2), {
    colors: {
      STRING_KEY: 'cyan', // On terminals where pure blue defaults to 0000FF, it can be hard to read against black
      STRING_LITERAL: 'reset', // The default color is likely to be the most readable
      NUMBER_LITERAL: 'green', // green.bold did not have enough contrast on many color schemes
      BOOLEAN_LITERAL: 'magentaBright', // Don't want to make this red or green because of associations with true and false; magenta had too little contrast
      NULL_LITERAL: 'red',
      BRACE: 'reset', // Because of indentation, visually distinct anyway
      BRACKET: 'reset', // Same as brace
      COLON: 'reset', // Visually distinct from other tokens without special coloring
      COMMA: 'gray', // These appear at entirely predictable places, so they can be less emphasized
    },
  });
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
