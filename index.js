const glob = require('glob');
const path = require('path');
const getEntryPoints = require('./entries');

module.exports = (options) => {
  const areas = glob.sync(path.resolve(options.context, 'Areas/*'));
  const entries = {};

  // Get entry points for Assets in root folder
  Object.assign(entries, getEntryPoints(options.context));

  // Get entry points for Assets in area folders
  areas.forEach((area) => {
    Object.assign(entries, getEntryPoints(area, path.basename(area)));
  });

  // Add aliases for Assets in root folder
  const aliases = {
    '@': path.resolve(options.context, options.assetsRoot),
  };

  // Add aliases for Assets in area folders
  areas.forEach((area) => {
    aliases[`@${path.basename(area)}`] = path.resolve(area, options.assetsRoot);
  });

  return {
    context: options.context,
    entry: entries,
    resolve: {
      alias: {
        ...aliases,
      },
    },
  };
};
