# aspnet-buildtools

Utilities for integrating modern build tools in ASP.NET projects.

See [AspNet.Frontends](https://github.com/Baune8D/AspNet.Frontends) for examples.

## Vite

### Basic configuration example:

```javascript
import { viteConfig } from 'aspnet-buildtools';
import { defineConfig } from 'vite'

export default defineConfig({
  ...viteConfig,
  // More Vite configuration
});
```

### Custom configuration example:

```javascript
import { getAliases, getEntryPoints, viteDevManifestPlugin } from 'aspnet-buildtools';
import { defineConfig } from 'vite'

export default defineConfig({
  ...viteConfig,
  build: {
    rollupOptions: {
      input: getEntryPoints(),
    },
    resolve: {
      alias: getAliases(),
    },
    plugins: [viteDevManifestPlugin()],
  },
});
```

## Webpack

### Basic configuration example:

```javascript
import { webpackConfig } from 'aspnet-buildtools';

export default {
  ...webpackConfig,
  // More Webpack configuration
}
```

### Custom configuration example:

```javascript
import { getAliases, getEntryPoints } from 'aspnet-buildtools';

export default {
  entry: getEntryPoints(),
  resolve: {
    alias: getAliases(),
  },
};
```
