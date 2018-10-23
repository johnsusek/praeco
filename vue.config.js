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
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'production') {
      config.module
        .rule('istanbul')
        .test(/\.(js|vue)$/)
        .enforce('post')
        .include.add('apollo-server')
        .add('src')
        .end()
        .use('istanbul-instrumenter-loader')
        .loader('istanbul-instrumenter-loader')
        .options({ esModules: true })
        .end();
    }
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3030/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/api-ws': {
        target: 'http://localhost:3333/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api-ws': ''
        }
      }
    }
  }
};
