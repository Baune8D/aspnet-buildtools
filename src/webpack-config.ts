import type webpack from 'webpack';
import { getAliases } from './aliases.js';
import { getEntryPoints } from './entry-points.js';

const cwd = process.cwd();

export const webpackConfig = {
  context: cwd,
  entry: getEntryPoints(cwd),
  resolve: {
    alias: getAliases(cwd),
  },
} satisfies webpack.Configuration;
