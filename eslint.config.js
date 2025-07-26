import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  // Base JavaScript configuration
  js.configs.recommended,
  
  // Vue 3 configuration
  ...vue.configs['flat/recommended'],
  
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      vue,
    },
    rules: {
      'vue/max-len': 'off',
      'vue/require-v-for-key': 'off',
      'vue/require-prop-types': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },
  
  // Configuration-specific overrides
  {
    files: ['eslint.config.js'],
    rules: {
      'no-undef': 'off',
    },
  },
];