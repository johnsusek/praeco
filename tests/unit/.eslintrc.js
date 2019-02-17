module.exports = {
  env: {
    mocha: true
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'max-len': ['error', { ignoreStrings: true, code: 120 }],
    'no-irregular-whitespace': 'off',
    'no-return-assign': 'off',
    'arrow-body-style': 'off'
  }
};
