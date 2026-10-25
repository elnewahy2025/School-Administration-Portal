/**
 * Service Worker for School Administration Portal PWA
 * Caching Strategy:
 * - Network-First for HTML documents (ensuring dynamic RBAC & live data)
 * - Stale-While-Revalidate for static assets, scripts, and fonts
 * - Network-Only for Supabase API calls, auth endpoints, and mutations
 */

const CACHE_NAME = "school-portal-cache-v1";
const OFFLINE_URL = "/offline.html";

// Pre-cached assets during installation
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/file.svg",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests and external Supabase API / Auth calls (Network-Only)
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("supabase.co")
  ) {
    return;
  }

  // 2. HTML Document Navigations: Network-First with Offline Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlineFallback = await caches.match(OFFLINE_URL);
          if (offlineFallback) {
            return offlineFallback;
          }
          return new Response(
            "<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'><title>لا يوجد اتصال</title></head><body style='font-family:system-ui;text-align:center;padding:2rem'><h2>لا يوجد اتصال بالإنترنت</h2><p>يرجى التحقق من اتصال الشبكة وإعادة المحاولة.</p></body></html>",
            { headers: { "Content-Type": "text/html; charset=utf-8" } },
          );
        }),
    );
    return;
  }

  // 3. Static Assets (_next/static, images, fonts): Stale-While-Revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|woff|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      }),
    );
  }
});
