module.exports = {
  'extends': 'airbnb-base/legacy',
  'env': {
    'node': true
  },
  'rules': {
    // Previous jscs rules required trailing commas,
    // ES6 style guide requires them when lists are one line each
    'comma-dangle': 'off',

    // Results in clearer (but misleading w/r/t scoping) code
    // ES6 style guide changes this once we have actual lexical scoping
    'vars-on-top': 'off',

    // Many of these will become arrow functions in ES6
    'func-names': 'off',

    // I agree with these, we'll take care of them in a fixup pass
    'padded-blocks': 'warn', // Previous rules allowed this
    'no-param-reassign': 'warn', // Previous rules allowed this
    'lines-around-directive': 'warn', // Previous rules allowed this, flagging on no newline after shebang
  }
};
