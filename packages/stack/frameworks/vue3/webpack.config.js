module.exports = (...args) => {
  const { webpackVue3Config } = require('./lib/webpack.config');
  return webpackVue3Config(...args);
};
