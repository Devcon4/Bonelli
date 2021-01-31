const Bundler = require('parcel-bundler');
const Path = require('path');

const entrypoint = Path.join(__dirname, './src/index.html');

(async () => {
  const bundler = new Bundler(entrypoint);
  await bundler.bundle();
})();
