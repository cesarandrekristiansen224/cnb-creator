// CNB Creator: viser push-varsler for admins.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'CNB', {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { tab: d.tab || '' }
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const tab = (e.notification.data && e.notification.data.tab) || '';
  const url = new URL(tab ? './#' + tab : './', self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if (w.url.startsWith(self.registration.scope)) {
        await w.focus();
        if (tab) w.postMessage({ tab });
        return;
      }
    }
    await self.clients.openWindow(url);
  })());
});
