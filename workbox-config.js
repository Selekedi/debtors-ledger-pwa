module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{html,js,css,png,svg,json}'],
  swSrc: 'src/service-worker.js',   // The file YOU wrote
  swDest: 'build/sw.js',            // The file Workbox generates
};

