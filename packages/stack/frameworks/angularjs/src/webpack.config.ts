import { BABEL_LOADER } from '@leanup/cli-core-babel/lib/webpack.config';
import webpackConfig from '@leanup/stack-webpack';

export default function webpackAngularJSConfig(env: any, argv: any): Object {
  return webpackConfig(env, argv, [BABEL_LOADER]);
}
