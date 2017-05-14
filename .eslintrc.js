module.exports = {
  'extends': 'airbnb',
  'env': {
    'node': true
  },
  'parserOptions': {
    'ecmaVersion': 6,

    // Airbnb preset sets this to 'module'
    // but everything outside of lib is a script
    'sourceType': 'script'
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

    // The Airbnb es5 style guide says nothing about using console,
    // and we legitimately need it for output
    'no-console': 'off',

    // Airbnb sets this to never even though their written style guide
    // never actually mentions it. Babel inserts it for them, but we're
    // not using Babel.
    'strict': ['warn', 'safe'], // Warn will be changed to an error after modules are fixed

    // The following settings will be fixed in a future commit
    'prefer-arrow-callback': 'warn',
    'no-var': 'warn',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
  }
};
