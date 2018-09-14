const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/,
        'element-ui/lib/locale/lang/en'
      )
    ]
  },
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:3030/',
        pathRewrite: {
          '/api': ''
        }
      }
    }
  }
};
