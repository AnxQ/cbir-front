module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    host: "localhost",
    port: 8082,
    https: false, 
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
          }
      }
    }
  }
}
