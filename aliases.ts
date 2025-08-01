import { glob } from 'glob';
import path from 'node:path';

export function getAliases(
  context?: string | undefined,
): Record<string, string> {
  if (!context) {
    context = process.cwd();
  }

  // Add aliases for the root folder
  const aliases: Record<string, string> = {
    '@': path.resolve(context),
  };

  // Add aliases for each area
  glob
    .sync(path.resolve(context, 'Areas/*'), {
      windowsPathsNoEscape: true,
    })
    .forEach((area) => {
      aliases[`@${path.basename(area)}`] = path.resolve(area);
    });

  return aliases;
}
