const VERSION = "robotizados-2026-11-09";
const ASSETS = ["index.html", "t1.html", "t2.html", "t3.html", "t4.html", "t5.html", "t6.html", "demostraciones.html", "practicas.html", "resueltos.html", "diapositivas.html", "interactivos.html", "resolver.html", "figuras.html", "animaciones.html", "calculadoras.html", "diapositivas-temario.html", "examenes.html", "simulacros.html", "autoevaluacion.html", "formulario.html", "glosario.html", "plan.html", "bibliografia.html", "manifest.webmanifest", "icon.svg", "search-index.json"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match("index.html"))));
});
