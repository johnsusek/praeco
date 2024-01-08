'use strict'

const utils = require('eslint-plugin-vue/lib/utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using v-model for custom component is affected by a breaking change in Vue 3.',
      categories: undefined,
      url: 'https://v3-migration.vuejs.org/ja/breaking-changes/v-model.html',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreComponentNames: {
            type: 'array',
          },
        },
      },
    ],
    messages: {
      error:
        'カスタムコンポーネントへのv-modelの使用は、Vue 3の破壊的変更の影響を受けるので使用しないでください。\nhttps://v3-migration.vuejs.org/ja/breaking-changes/v-model.html',
    },
  },
  /** @param {RuleContext} context */
  create(context) {
    const ignoreComponentNames = context.options[0]?.ignoreComponentNames ?? []
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='model']"(node) {
        const element = node.parent.parent
        if (
          utils.isCustomComponent(node.parent.parent) &&
          !ignoreComponentNames.includes(element.name)
        ) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'error',
          })
        }
      },
    })
  },
}