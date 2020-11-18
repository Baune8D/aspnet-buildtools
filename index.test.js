const configBuilder = require('./index');

test('config options', () => {
  const config = configBuilder({
    context: __dirname,
    assetsRoot: 'Assets',
  });
  expect(config.context).toBe(__dirname);
});
