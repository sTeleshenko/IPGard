const conf = require('./gulp.conf');
var proxyMiddleware = require('http-proxy-middleware');
module.exports = function () {
  var middleware = proxyMiddleware('/api', {target: 'http://localhost:8080', changeOrigin: 'localhost'});
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      routes: {
        '/bower_components': 'bower_components'
      },
      middleware: middleware
    },
    open: false
  };
};
