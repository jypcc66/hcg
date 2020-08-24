module.exports = {
  lintOnSave: false,
  assetsDir:'assets',
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/dev': {
        target: 'https://haicaogo.com',
        secure: true,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/dev': '/dev'
        }
      }
    }
  }
}
