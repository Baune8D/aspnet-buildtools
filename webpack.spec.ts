import { expect, test } from '@jest/globals';
import path from 'node:path';
import { webpackConfig } from './webpack.js';

test('webpack config', () => {
  // Arrange
  const context = path.resolve(import.meta.dirname, 'example');

  // Act
  const config = webpackConfig(context);

  // Assert
  expect(config.context).toBe(context);

  expect(config.entry).toBeTruthy();
  const entries = config.entry as Record<string, string>;
  expect(Object.keys(entries).length).toBe(5);
  expect(entries['Bundle']).toBe(
    path.resolve(context, 'Assets/bundles/Bundle.bundle.js'),
  );
  expect(entries['Pages_Home_Index']).toBe(
    path.resolve(context, 'Pages/Home/Index.cshtml.js'),
  );
  expect(entries['Views_Home_Index']).toBe(
    path.resolve(context, 'Views/Home/Index.cshtml.js'),
  );
  expect(entries['Areas_Sub_Pages_Home_Index']).toBe(
    path.resolve(context, 'Areas/Sub/Pages/Home/Index.cshtml.js'),
  );
  expect(entries['Areas_Sub_Views_Home_Index']).toBe(
    path.resolve(context, 'Areas/Sub/Views/Home/Index.cshtml.js'),
  );

  expect(config.resolve?.alias).toBeTruthy();
  const aliases = config.resolve?.alias as Record<string, string>;
  expect(Object.keys(aliases).length).toBe(2);
  expect(aliases['@']).toBe(context);
  expect(aliases['@Sub']).toBe(path.resolve(context, 'Areas/Sub'));
});
