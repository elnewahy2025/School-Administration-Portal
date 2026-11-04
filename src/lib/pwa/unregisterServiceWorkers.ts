/**
 * Removes any service worker registration and clears its caches.
 *
 * Used in development only: dev chunk URLs are not content-addressed, so a
 * caching service worker left over from an earlier session serves stale modules
 * and breaks the page after a recompile.
 */
export async function unregisterServiceWorkers(): Promise<void> {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    if (registrations.length > 0) {
      console.log("[PWA] Service Worker disabled in development; stale caches cleared.");
    }
  } catch (error) {
    console.error("[PWA] Failed to unregister the development Service Worker:", error);
  }
}
