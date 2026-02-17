import vue from "eslint-plugin-vue";
import rulesdir from "eslint-plugin-rulesdir";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// Set up rules directory
rulesdir.RULES_DIR = 'eslint/rules';

export default [
    {
        ignores: ["node_modules/", "dist/", ".eslintrc.js", "eslint.config.mjs"],
    },
    js.configs.recommended,
    ...vue.configs["flat/strongly-recommended"],
    {
        plugins: {
            vue,
            rulesdir,
            import: importPlugin,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha,
                ...globals.browser,
            },
            ecmaVersion: 2022,
            sourceType: "module",
        },

        rules: {
            // Essential code quality rules (Airbnb-style)
            "indent": ["error", 2],
            "semi": ["error", "always"],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "comma-spacing": ["error", { "before": false, "after": true }],
            "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
            "keyword-spacing": ["error", { "before": true, "after": true }],
            "space-before-blocks": ["error", "always"],
            "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
            "eol-last": ["error", "always"],
            "no-trailing-spaces": "error",
            "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
            // Vue and custom overrides
            "vue/max-len": "off",
            "import/no-unresolved": "off",
            "vuejs-accessibility/rule-name": "off",
            "vuejs-accessibility/label-has-for": "off",
            "vuejs-accessibility/click-events-have-key-events": "off",
            "vuejs-accessibility/no-autofocus": "off",
            "vuejs-accessibility/anchor-has-content": "off",
            quotes: ["error", "single"],
            "no-underscore-dangle": "off",
            "no-empty": "off",
            radix: "off",
            "no-cond-assign": "off",
            "no-plusplus": "off",
            "default-case": "off",
            "no-labels": "off",
            "no-restricted-syntax": "off",
            "consistent-return": "off",
            "func-names": "off",
            "arrow-parens": "off",
            camelcase: "off",
            "no-console": "off",
            "no-alert": "off",
            "prefer-const": "off",
            "comma-dangle": "off",
            "prefer-destructuring": "off",
            "space-before-function-paren": "off",
            "no-new": "off",
            "max-len": "off",
            "vue/require-v-for-key": "off",
            "vue/require-prop-types": "off",
            "vue/max-attributes-per-line": "off",
            "import/prefer-default-export": "off",
            "vue/multi-word-component-names": "off",
            "import/no-cycle": "off",
            "vue/no-deprecated-destroyed-lifecycle": "error",
            "vue/no-deprecated-v-on-native-modifier": "error",
            "vue/no-deprecated-v-bind-sync": "error",
            "import/extensions": ["off", "always", {
                js: "never",
                vue: "never",
            }],

            "no-param-reassign": "off",

            "import/no-extraneous-dependencies": ["error", {
                optionalDependencies: ["test/unit/index.js"],
            }],

            "no-debugger": "off",

            "vue/html-closing-bracket-newline": ["error", {
                singleline: "never",
                multiline: "never",
            }],

            "no-restricted-imports": ["error", {
                paths: [{
                    name: "vue",
                    importNames: ["default"],
                }],
            }],
            "no-unused-vars": ["error", { 
                argsIgnorePattern: "^error$",
                caughtErrorsIgnorePattern: "^error$"
            }],
        },
    },
    {
        files: ["src/App.vue"],
        rules: {
            "vue/v-on-event-hyphenation": "off",
        },
    },
    {
        files: [
            "src/components/ESChart.vue",
            "src/contrib.js",
            "src/main.js",
            "src/registration.js",
            "src/router.js",
            "src/store/config/match.js",
            "src/store/config/settings.js",
            "src/store/configs.js",
            "src/store/index.js",
            "src/store/metadata.js",
        ],
        rules: {
            "no-restricted-imports": "off",
        },
    },
    {
        files: [
            "src/views/ConfigBuilder.vue",
        ],
        rules: {
            "vue/v-on-event-hyphenation": "off",
        },
    },
    {
        files: ["tests/e2e/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.mocha,
                cy: "readonly",
            },
        },
        rules: {
            strict: "off",
            "max-len": "off",
        },
    },
    {
        files: ["tests/unit/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
        rules: {
            "arrow-body-style": "off",
            "no-unused-expressions": "off",
            "no-return-assign": "off",
            "import/no-extraneous-dependencies": "off",
            "max-len": "off",
            "no-irregular-whitespace": "off",
        },
    },
];