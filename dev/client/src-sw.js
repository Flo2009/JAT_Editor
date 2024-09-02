const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
// Cache for static assets (CSS, JS, and images)
const assetCache = new StaleWhileRevalidate({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 50, // Maximum number of items in cache
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache expiration time (30 days)
    }),
  ],
});

// Cache CSS files
registerRoute(
  ({ request }) => request.destination === 'style',
  assetCache
);

// Cache JavaScript files
registerRoute(
  ({ request }) => request.destination === 'script',
  assetCache
);

// Cache image files
registerRoute(
  ({ request }) => request.destination === 'image',
  assetCache
);

// registerRoute();
