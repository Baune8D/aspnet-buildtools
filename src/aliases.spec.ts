import { expect, test } from '@jest/globals';
import path from 'node:path';
import { getAliases } from './aliases.js';

test('aliases', () => {
  // Arrange
  const context = path.resolve(import.meta.dirname, '..', 'example');

  // Act
  const aliases = getAliases(context);

  // Assert
  expect(Object.keys(aliases)).toHaveLength(2);
  expect(aliases['@']).toBe(context);
  expect(aliases['@Sub']).toBe(path.resolve(context, 'Areas/Sub'));
});
