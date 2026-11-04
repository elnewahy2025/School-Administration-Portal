"use client";

import { useEffect } from "react";
import { unregisterServiceWorkers } from "@/lib/pwa/unregisterServiceWorkers";

/**
 * Registers the PWA service worker in production.
 *
 * In development the service worker is deliberately disabled and any previously
 * registered one is removed: dev chunk URLs are not content-addressed and the
 * dev server serves them with `Cache-Control: no-cache`, so a caching service
 * worker would keep returning stale modules after a recompile and break the
 * page with "module factory is not available".
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void unregisterServiceWorkers();
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    };

    // The effect can run after the load event already fired, so a plain
    // `load` listener would never call back and the worker would never register.
    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });

    return () => {
      window.removeEventListener("load", register);
    };
  }, []);

  return null;
}
