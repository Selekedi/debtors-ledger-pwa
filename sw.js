/* eslint-env serviceworker */
/* global workbox */
/* eslint-disable no-restricted-globals */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([{"revision":"8f40091a3c23571f1bfd715a874c0615","url":"404.html"},{"revision":"61fc43b5181f21af0d5afe2d6961d35d","url":"asset-manifest.json"},{"revision":"a537c8c11a390a6c262feabe6b22eba0","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"},{"revision":"82198f21dbbf26384bf2d8b55e8f016b","url":"manifest.json"},{"revision":"0255b90eced20e735e60d06056bcd100","url":"service-worker.js"},{"revision":"4a36d3f1dc8f5a4d08d2d9c334123e57","url":"static/css/main.3b0bf5f0.css"},{"revision":"f4c6cb76ea386a552b5ca0eb1080a4ad","url":"static/js/453.32a044c9.chunk.js"},{"revision":"a98c9dab7b3b2565fa41200c171f8275","url":"static/js/main.81f344d7.js"},{"revision":"06e733283fa43d1dd57738cfc409adbd","url":"static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg"}] || []);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate()
);

