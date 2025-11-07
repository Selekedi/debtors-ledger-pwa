/* eslint-env serviceworker */
/* global workbox */
/* eslint-disable no-restricted-globals */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([{"revision":"8f40091a3c23571f1bfd715a874c0615","url":"404.html"},{"revision":"f47d43c4d422a3124f7a2d697a64dff9","url":"asset-manifest.json"},{"revision":"6ee388a607eff3a599eaf1adc813558c","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"},{"revision":"82198f21dbbf26384bf2d8b55e8f016b","url":"manifest.json"},{"revision":"c9c6293264d7bfc13f50cdfb6ae5080c","url":"service-worker.js"},{"revision":"4a36d3f1dc8f5a4d08d2d9c334123e57","url":"static/css/main.3b0bf5f0.css"},{"revision":"f4c6cb76ea386a552b5ca0eb1080a4ad","url":"static/js/453.32a044c9.chunk.js"},{"revision":"9bd9250c482ecddd446672c54efede6a","url":"static/js/main.395b4cbf.js"},{"revision":"06e733283fa43d1dd57738cfc409adbd","url":"static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg"}] || []);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate()
);

