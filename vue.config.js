const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    performance: {
      hints: false
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /element-ui[/\\]lib[/\\]locale[/\\]lang[/\\]zh-CN/,
        'element-ui/lib/locale/lang/en'
      )
    ]
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true
  }
};
