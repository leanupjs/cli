import { resolve } from 'path';

// import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default {
  alias: {
    inferno: process.env.NODE_ENV === 'production' ? 'inferno/dist/index.esm.js' : 'inferno/dist/index.dev.esm.js',
  },
  css: {
    postcss: require(resolve(process.cwd(), 'postcss.config')),
  },
  plugins: [
    // replace({}),
  ],
  server: {
    port: 8080,
  },
};
