# aspnet-buildtools

Utilities for integrating modern build tools in ASP.NET projects.

See [AspNet.Frontends](https://github.com/Baune8D/AspNet.Frontends) for examples.

## Webpack

Import basic Webpack configuration using:
```javascript
import { webpackConfig } from 'aspnet-buildtools';

export default {
  ...webpackConfig(),
  // More Webpack configuration here
}
```

A build context can optionally be passed to `webpackConfig`, `process.cwd()` will be used as default.

For more advanced configurations it might be easier to  configure it manually:

```javascript
import { getEntryPoints } from 'aspnet-buildtools';
import { getAliases } from 'aspnet-buildtools';

const context = process.cwd();

export default {
  context: context,
  entry: getEntryPoints(context),
  resolve: {
    alias: getAliases(context),
  },
};