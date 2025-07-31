import { glob } from 'glob';
import path from 'node:path';

export function getEntryPoints(context: string): Record<string, string> {
  const entries = {} as Record<string, string>;

  // Get all predefined asset bundles
  const bundleGlob = path.resolve(context, '**/*.bundle.@(js|ts)');
  const bundles = glob.sync(bundleGlob, {
    ignore: ['**/node_modules/**'],
    windowsPathsNoEscape: true,
  });

  bundles.forEach((bundle) => {
    const name = bundle
      .replace(`${path.dirname(bundle)}${path.sep}`, '')
      .replace(`.bundle${path.extname(bundle)}`, '');
    entries[name] = bundle;
  });

  const ignore = ['**/node_modules/**', '**/_*.cshtml', '**/Components/*/*.*'];

  // Find all views and razor pages
  const viewGlob = path.resolve(context, '**/*.cshtml');
  const views = glob.sync(viewGlob, {
    ignore,
    windowsPathsNoEscape: true,
  });

  // Get all asset view folders containing an index.js file
  const assetViewGlob = path.resolve(context, '**/*.cshtml.@(js|ts)');
  const assetViews = glob.sync(assetViewGlob, {
    ignore,
    windowsPathsNoEscape: true,
  });

  assetViews.forEach((view) => {
    const filePath = view.replace(path.extname(view), '');

    // If the folder path matches a razor view, include it as a bundle
    if (views.includes(filePath)) {
      const dirname = path
        .dirname(view)
        .replace(`${context}${path.sep}`, '')
        .split(path.sep)
        .join('_');
      const basename = path.basename(
        view.replace(path.extname(view), ''),
        '.cshtml',
      );
      entries[`${dirname}_${basename}`] = view;
    }
  });

  return entries;
}
