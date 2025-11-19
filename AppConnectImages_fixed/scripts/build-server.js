// build-server.js
// Bundles server code into dist/server using esbuild
const esbuild = require('esbuild');
const path = require('path');
(async () => {
  try {
    await esbuild.build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      outfile: 'dist/server/index.js',
      format: 'cjs',
      sourcemap: false,
      external: [],
    });
    console.log('Server build complete');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
