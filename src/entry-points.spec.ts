import { expect, test } from '@jest/globals';
import path from 'node:path';
import { getEntryPoints } from './entry-points.js';

test('entry points', () => {
  // Arrange
  const context = path.resolve(import.meta.dirname, '..', 'example');

  // Act
  const entryPoints = getEntryPoints(context);

  // Assert
  expect(Object.keys(entryPoints)).toHaveLength(5);
  expect(entryPoints['Bundle']).toBe(
    path.resolve(context, 'Assets/bundles/Bundle.bundle.js'),
  );
  expect(entryPoints['Pages_Home_Index']).toBe(
    path.resolve(context, 'Pages/Home/Index.cshtml.js'),
  );
  expect(entryPoints['Views_Home_Index']).toBe(
    path.resolve(context, 'Views/Home/Index.cshtml.js'),
  );
  expect(entryPoints['Areas_Sub_Pages_Home_Index']).toBe(
    path.resolve(context, 'Areas/Sub/Pages/Home/Index.cshtml.js'),
  );
  expect(entryPoints['Areas_Sub_Views_Home_Index']).toBe(
    path.resolve(context, 'Areas/Sub/Views/Home/Index.cshtml.js'),
  );
});
