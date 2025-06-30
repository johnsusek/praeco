const rulesDirPlugin = require('eslint-plugin-rulesdir');

rulesDirPlugin.RULES_DIR = 'eslint/rules';

module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true
  },
  extends: ['plugin:vue/vue3-recommended', '@vue/eslint-config-airbnb'],
  plugins: [
    'rulesdir'
  ],
  rules: {
    'rulesdir/custom1': 'off',
    'vue/max-len': 'off',
    'import/no-unresolved': 'off',
    'vuejs-accessibility/rule-name': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/no-autofocus': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
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
    'max-len': 'off',
    'vue/require-v-for-key': 'off',
    'vue/require-prop-types': 'off',
    'vue/max-attributes-per-line': 'off',
    'import/prefer-default-export': 'off',
    'vue/multi-word-component-names': 'off',
    'import/no-cycle': 'off',
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
    ],
    'no-restricted-imports': [
      'error',
      {
        'paths': [
          {
            'name': 'vue',
            'importNames': ['default']
          },
        ],
      },
    ],
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  overrides: [
    {
      files: [
        '.eslintrc.js',
      ],
      rules: {
        'quote-props': 'off',
      },
    },
    {
      files: [
        'src/components/ESChart.vue',
        'src/contrib.js',
        'src/main.js',
        'src/registration.js',
        'src/router.js',
        'src/store/config/match.js',
        'src/store/config/settings.js',
        'src/store/configs.js',
        'src/store/index.js',
        'src/store/metadata.js'
      ],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ]
};
