/* eslint-env serviceworker */
/* global workbox */
/* eslint-disable no-restricted-globals */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([{"revision":"8f40091a3c23571f1bfd715a874c0615","url":"404.html"},{"revision":"e720b7522b04603a2fc1750400554300","url":"asset-manifest.json"},{"revision":"1a08730b43db4d46e232525c2ae5c530","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"},{"revision":"82198f21dbbf26384bf2d8b55e8f016b","url":"manifest.json"},{"revision":"eabb21735c6a3388a2960b08092b6709","url":"service-worker.js"},{"revision":"2bbd53ee192e24280923c4d2d1b25c7f","url":"static/css/main.3a1b14ba.css"},{"revision":"f4c6cb76ea386a552b5ca0eb1080a4ad","url":"static/js/453.32a044c9.chunk.js"},{"revision":"49f5d47600afd1b1f17b20d315871416","url":"static/js/main.cbcdb008.js"},{"revision":"06e733283fa43d1dd57738cfc409adbd","url":"static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg"}] || []);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate()
);

