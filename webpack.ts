import type webpack from 'webpack';
import { getAliases } from './aliases.js';
import { getEntryPoints } from './entry-points.js';

export function webpackConfig(context: string): webpack.Configuration {
  return {
    context: context,
    entry: getEntryPoints(context),
    resolve: {
      alias: getAliases(context),
    },
  };
}
