/**
 * dev service config
 */

const path = require('path')
const currentHost = 'http://192.168.110.215:8084'

module.exports = {
  contentBase: path.join(__dirname, '../dist'),
  hot: true,
  host: '0.0.0.0',
  port: 8002,
  proxy: {
    '/api/': {
      target: `${currentHost}/api`,
      changeOrigin: true,
      pathRewrite: { '/api/': '' },
    },
  },
}