# aspnet-buildtools

[![npm version](https://img.shields.io/npm/v/aspnet-buildtools)](https://www.npmjs.com/package/aspnet-buildtools)
[![npm downloads](https://img.shields.io/npm/dm/aspnet-buildtools)](https://www.npmjs.com/package/aspnet-buildtools)
[![CI](https://github.com/Baune8D/aspnet-buildtools/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Baune8D/aspnet-buildtools/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/Baune8D/aspnet-buildtools)](https://github.com/Baune8D/aspnet-buildtools/blob/main/LICENSE)

**Vite and Webpack configuration for ASP.NET Core MVC and Razor Pages.** aspnet-buildtools scans your project for Razor views and creates one entry point per view, plus import aliases for the project root and each area. Put an `Index.cshtml.js` next to `Views/Home/Index.cshtml` and it becomes the `Views_Home_Index` bundle.

It is the frontend half of [AspNet.AssetManager](https://github.com/Baune8D/AspNet.AssetManager), which renders the matching `<script>` and `<link>` tags in your views.

## Install

```bash
npm install --save-dev aspnet-buildtools
```

Requires Node.js 22 or later, and Vite 8+ or Webpack 5. For Vite 7 and earlier, use `aspnet-buildtools@0.2`.

## How it works

Run your bundler from the ASP.NET Core project folder. aspnet-buildtools finds these entry points:

| File                                           | Bundle name                    |
| ---------------------------------------------- | ------------------------------ |
| `Views/Home/Index.cshtml.js`                   | `Views_Home_Index`             |
| `Pages/Account/Login.cshtml.ts`                | `Pages_Account_Login`          |
| `Areas/Admin/Views/Users/Edit.cshtml.js`       | `Areas_Admin_Views_Users_Edit` |
| `Assets/bundles/Layout.bundle.js` (any folder) | `Layout`                       |

- A `.cshtml.js` / `.cshtml.ts` file is only used if a `.cshtml` file with the same name exists next to it.
- Partial views (`_*.cshtml`), view components (`Components/*/`) and `node_modules` are skipped.
- `*.bundle.js` / `*.bundle.ts` files are named after the file, without the `.bundle` part.

It also sets up import aliases:

| Alias      | Resolves to                                    |
| ---------- | ---------------------------------------------- |
| `@/`       | The project root                               |
| `@<Area>/` | `Areas/<Area>/`, for each area, e.g. `@Admin/` |

```js
// Views/Home/Index.cshtml.js
import '@/Assets/css/site.css';
import { initGrid } from '@Admin/Shared/grid.js';
```

## Vite

```js
// vite.config.js
import { viteConfig } from 'aspnet-buildtools';
import { defineConfig } from 'vite';

export default defineConfig({
  ...viteConfig,
  build: {
    ...viteConfig.build,
    assetsDir: '',
    manifest: 'assets-manifest.json',
    outDir: 'wwwroot/dist',
  },
  server: {
    cors: true,
  },
});
```

Vite only writes a manifest when building. `viteConfig` includes `viteDevManifestPlugin()`, which serves a manifest from the dev server at the `build.manifest` path. AspNet.AssetManager can then find your entry points in development too.

- Set `build.manifest` to the same file name as `ManifestFile` in AspNet.AssetManager.
- If you use `manifest: true`, the dev manifest is served at `/.vite/manifest.dev.json` and the production manifest is written to `.vite/manifest.json`. In that case, set `ManifestFile` separately in `appsettings.Development.json`.

To pick the parts yourself:

```js
// vite.config.js
import {
  getAliases,
  getEntryPoints,
  viteDevManifestPlugin,
} from 'aspnet-buildtools';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    manifest: 'assets-manifest.json',
    rolldownOptions: {
      input: getEntryPoints(),
    },
  },
  resolve: {
    alias: getAliases(),
  },
  plugins: [viteDevManifestPlugin()],
});
```

## Webpack

```js
// webpack.config.js
import { webpackConfig } from 'aspnet-buildtools';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';

export default {
  ...webpackConfig,
  plugins: [new WebpackAssetsManifest()],
};
```

To pick the parts yourself:

```js
// webpack.config.js
import { getAliases, getEntryPoints } from 'aspnet-buildtools';

export default {
  entry: getEntryPoints(),
  resolve: {
    alias: getAliases(),
  },
};
```

Webpack only picks up new entry points when the dev server restarts.

## API

| Export                     | Description                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `getEntryPoints(context?)` | Returns `{ [bundleName]: absolutePath }` for all entry points under `context`.           |
| `getAliases(context?)`     | Returns `{ '@': root, '@<Area>': areaPath }`.                                            |
| `viteDevManifestPlugin()`  | Vite plugin that serves a manifest of `build.rolldownOptions.input` from the dev server. |
| `viteConfig`               | Partial Vite config with entry points, aliases and the dev manifest plugin.              |
| `webpackConfig`            | Partial Webpack config with `context`, entry points and aliases.                         |

`context` defaults to `process.cwd()`. `viteConfig` and `webpackConfig` are built from `process.cwd()` when the module is loaded.

## Related projects

- [AspNet.AssetManager](https://github.com/Baune8D/AspNet.AssetManager): ASP.NET Core tag helpers that render bundles from the manifest.
- [AspNet.Frontend.Templates](https://github.com/Baune8D/AspNet.Frontend.Templates): `dotnet new` templates and example projects that use both packages.

## Development

```bash
npm ci
npm run lint
npm test
npm run build
```

## License

[MIT](https://github.com/Baune8D/aspnet-buildtools/blob/main/LICENSE)
