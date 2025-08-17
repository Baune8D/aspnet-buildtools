import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

export function viteDevManifestPlugin(opts: { outDir?: string } = {}): Plugin {
  let config: ResolvedConfig;
  let manifestJSON = '{}';

  function generateManifest(root: string) {
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

    manifestJSON = JSON.stringify(manifest, null, 2);
  }

  function getManifestUrl() {
    let manifestOut = config.build.manifest;

    if (manifestOut === false) {
      console.warn('[dev-manifest] build.manifest needs to be configured.');
      return;
    }

    if (manifestOut === true) {
      manifestOut = '.vite/manifest.dev.json';
    }

    opts.outDir ??= 'dist';
    return path.join('/', opts.outDir, manifestOut);
  }

  return {
    name: 'dev-manifest',
    apply: 'serve', // dev only
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      generateManifest(config.root);

      const manifestUrl = getManifestUrl();

      server.middlewares.use((req, res, next) => {
        if (req.method === 'GET' && req.url === manifestUrl) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(manifestJSON);
          return;
        }
        next();
      });
    },
  };
}
