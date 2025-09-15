// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // ブラウザターゲットは必要に応じて調整
        targets: 'defaults',
        useBuiltIns: false, // polyfillは不要ならfalse
      },
    ],
  ],
  plugins: [
    // 構文認識用（必須）
    '@babel/plugin-syntax-object-rest-spread',

    // トランスフォーム用（vite-plugin-vue2 も依存している）
    '@babel/plugin-proposal-object-rest-spread',

    // よく使う構文も追加しておくと安心
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};
