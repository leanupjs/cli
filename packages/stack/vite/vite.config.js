const { resolve } = require('path');

// https://vitejs.dev/config/
module.exports = {
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        paths: ['node_modules'],
      },
      sass: {
        implementation: require('sass'),
        sassOptions: {
          includePaths: ['node_modules'],
        },
      },
    },
  },
  server: {
    port: 8080,
  },
};
