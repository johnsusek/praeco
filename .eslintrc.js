module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true
  },
  extends: ['plugin:vue/recommended', '@vue/airbnb'],
  rules: {
    quotes: ['error', 'single'],
    'no-underscore-dangle': 'off',
    'no-empty': 'off',
    radix: 'off',
    'no-cond-assign': 'off',
    'no-plusplus': 'off',
    'default-case': 'off',
    'no-labels': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
    'arrow-parens': 'off',
    camelcase: 'off',
    'no-console': 'off',
    'no-alert': 'off',
    'prefer-const': 'off',
    'comma-dangle': 'off',
    'prefer-destructuring': 'off',
    'space-before-function-paren': 'off',
    'no-new': 'off',
    'max-len': ['error', { ignoreStrings: true, code: 120 }],
    'vue/require-v-for-key': 'off',
    'vue/require-prop-types': 'off',
    'vue/max-attributes-per-line': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'off',
      'always',
      {
        js: 'never',
        vue: 'never'
      }
    ],
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
