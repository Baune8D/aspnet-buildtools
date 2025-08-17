import type { UserConfig } from 'vite';
import { getAliases } from './aliases.js';
import { getEntryPoints } from './entry-points.js';
import { viteDevManifestPlugin } from './vite-dev-manifest-plugin.js';

const cwd = process.cwd();

export const viteConfig = {
  build: {
    rollupOptions: {
      input: getEntryPoints(cwd),
    },
  },
  resolve: {
    alias: getAliases(cwd),
  },
  plugins: [viteDevManifestPlugin()],
} satisfies UserConfig;
