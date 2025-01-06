const webpack = require('webpack');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const ICons = require('unplugin-icons/webpack');

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : '/',
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'coverage' ? 'eval' : undefined,
    performance: {
      hints: false
    },
    resolve: {
      extensions: ['.ts', '.js', '.mjs', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/i,
          resolve: { byDependency: { esm: { fullySpecified: false } } },
        },
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin({ LATER_COV: false }),
      ICons.default({ /* options */ }),
      AutoImport.default({
        resolvers: [ElementPlusResolver()],
      }),
      Components.default({
        resolvers: [ElementPlusResolver()],
      }),
    ]
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'production') {
      config.module
        .rule('istanbul')
        .test(/\.(js|vue)$/)
        .enforce('post')
        .include.add(`${__dirname}apollo-server`)
        .add(`${__dirname}src`)
        .end()
        .use('@jsdevtools/coverage-istanbul-loader')
        .loader('@jsdevtools/coverage-istanbul-loader')
        .options({ esModules: true })
        .end();
    }
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    allowedHosts: ['all'],
    proxy: {
      '/api-app/releases': {
        target: 'https://api.github.com/repos/johnsusek/praeco/releases',
        changeOrigin: true,
        pathRewrite: {
          '^/api-app/releases': ''
        }
      },
      '/api-ws/test': {
        target: 'http://localhost:3333/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api-ws/test': '/test'
        }
      },
      '/api': {
        target: 'http://localhost:3030/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
