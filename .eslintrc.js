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
    // Have to override the airbnb rules, which want training commas for function
    // arguments, even though these are only supported in ES2017 and up.
    // Overriding this rule involves setting all of the same options except for
    // 'functions'. https://github.com/eslint/eslint/issues/7851#issuecomment-270428874
    'comma-dangle': ['warn', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never', // This is the actual change from the airbnb rules
    }],

    // Many of these will become arrow functions in ES6
    'func-names': 'off',

    // The Airbnb style guide says nothing about using console,
    // and we legitimately need it for output
    'no-console': 'off',

    // Airbnb sets this to 'never' even though their written style guide
    // never actually mentions it. Babel inserts it for them, but we're
    // not using Babel.
    'strict': ['error', 'safe'],
  }
};
