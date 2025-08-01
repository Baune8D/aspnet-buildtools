import type webpack from 'webpack';
import { getAliases } from './aliases.js';
import { getEntryPoints } from './entry-points.js';

export function webpackConfig(
  context?: string | undefined,
): webpack.Configuration {
  if (!context) {
    context = process.cwd();
  }

  return {
    context: context,
    entry: getEntryPoints(context),
    resolve: {
      alias: getAliases(context),
    },
  };
}
