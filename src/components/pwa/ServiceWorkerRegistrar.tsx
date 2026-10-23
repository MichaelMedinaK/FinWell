'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      // La app funciona sin service worker; solo se pierde el soporte offline.
      console.warn('No se pudo registrar el service worker', error);
    });
  }, []);

  return null;
}
