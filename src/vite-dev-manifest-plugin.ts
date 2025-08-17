import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

export function viteDevManifestPlugin(opts: { outDir?: string } = {}): Plugin {
  let config: ResolvedConfig;

  async function generateManifest(root: string) {
    const entries = config.build.rollupOptions.input;

    if (typeof entries !== 'object' || Array.isArray(entries)) {
      console.warn(
        '[dev-manifest] build.rollupOptions.input should be an object.',
      );
      return;
    }

    const manifest: Record<string, { name: string; src: string }> = {};

    for (const [name, src] of Object.entries(entries)) {
      let relativeSrc = path.relative(root, path.resolve(root, src));
      relativeSrc = relativeSrc.split(path.sep).join('/');

      manifest[relativeSrc] = {
        name,
        src: relativeSrc,
      };
    }

    let manifestOut = config.build.manifest;

    if (manifestOut === false) {
      console.warn('[dev-manifest] build.manifest needs to be configured.');
      return;
    }

    if (manifestOut === true) {
      manifestOut = '.vite/manifest.dev.json';
    }

    if (opts.outDir) {
      manifestOut = path.join(opts.outDir, manifestOut);
    }

    const manifestPath = path.resolve(root, manifestOut);

    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  }

  return {
    name: 'dev-manifest',
    apply: 'serve', // dev only
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      generateManifest(config.root).catch((e: unknown) => {
        server.config.logger.error(e as string);
      });
    },
  };
}
