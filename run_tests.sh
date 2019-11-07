#!/bin/bash

# This text breaks on the linux build server because of canvas polyfill issues.
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/alertText.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/ConfigAlert.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/ConfigYaml.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/ErrorsLog.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/luceneSyntaxBuilder.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/QueriesLog.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/RuleView.spec.js &&
./node_modules/.bin/vue-cli-service test:unit tests/unit/specs/SilenceLog.spec.js

