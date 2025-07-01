/* eslint-env serviceworker */
/* global workbox */
/* eslint-disable no-restricted-globals */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([{"revision":"ed151ec6149bede0ef47d9b19bbb77d0","url":"asset-manifest.json"},{"revision":"2f4efb6347373079a83fdf2736197cc1","url":"index.html"},{"revision":"33dbdd0177549353eeeb785d02c294af","url":"logo192.png"},{"revision":"917515db74ea8d1aee6a246cfbcc0b45","url":"logo512.png"},{"revision":"82198f21dbbf26384bf2d8b55e8f016b","url":"manifest.json"},{"revision":"8361b8b55c2328241eda1235308587fe","url":"service-worker.js"},{"revision":"2bbd53ee192e24280923c4d2d1b25c7f","url":"static/css/main.3a1b14ba.css"},{"revision":"f4c6cb76ea386a552b5ca0eb1080a4ad","url":"static/js/453.32a044c9.chunk.js"},{"revision":"c829ee7377d2836be7ac60bb7fd43a28","url":"static/js/main.314dfd5a.js"},{"revision":"06e733283fa43d1dd57738cfc409adbd","url":"static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg"}] || []);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate()
);

