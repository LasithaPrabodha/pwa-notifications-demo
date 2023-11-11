/**
 * Author: Lasitha Weligampola Gedara
 * Date: 2023/10/09
 *
 * Cache Strategy: Stale While Revalidate
 */

const VERSION = "v1";

// Create a base cache on Install
self.addEventListener("install", (event) => {
  console.log(`${VERSION} installing…`);

  const fileList = ["/", "/index.html", "/manifest.json", "/style.css", "/src/main.js"];

  const addResourcesToCache = async (resources) => {
    const cache = await caches.open(VERSION);
    await cache.addAll(resources);
  };

  self.skipWaiting();

  event.waitUntil(addResourcesToCache(fileList));
});

self.addEventListener("activate", (event) => {
  // Claims control over all uncontrolled tabs/windows
  event.waitUntil(clients.claim());

  const deleteOld = async () => {
    const cacheNames = await caches.keys();

    await Promise.all(cacheNames.filter((item) => item !== VERSION).map((item) => caches.delete(item)));
  };

  // Delete all old caches after taking control
  event.waitUntil(deleteOld());

  console.log(`${VERSION} activated...`);
});

self.addEventListener("fetch", (event) => {
  const storeInCache = async (request, response) => {
    const cache = await caches.open(VERSION);

    if (request.method === "POST") {
      console.log("Cannot cache POST requests");
      return;
    }

    await cache.put(request, response);
  };

  const cacheFirst = async (request) => {
    // First, Service Worker will retrieve the asset from the cache
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }

    // If not present in the cache it will call the APIs
    const responseFromNetwork = await fetch(request);

    // Then store them in the cache
    storeInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  };

  event.respondWith(cacheFirst(event.request));
});

self.addEventListener("notificationclick", (event) => {
  const action = event.action;

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(action === "agree" ? "So we both agree on that!" : "Let's agree to disagree.");
    });
  });
});
