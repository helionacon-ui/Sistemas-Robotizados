import re, json, html, os, shutil
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(RAIZ,'descargas','Guia_estudio_Sistemas_Robotizados.html')
OUT=RAIZ  # las páginas se publican en la raíz del repositorio
s=open(SRC,encoding='utf-8').read()
head=s[:s.index('</head>')]
head=re.sub(r'<title>.*?</title>','<title>{TITLE}</title>',head,count=1,flags=re.S)
head=head.replace('<meta name="viewport"','<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#b9561a">\n<link rel="icon" href="icon.svg" type="image/svg+xml">\n<meta name="viewport"',1)
secs=re.findall(r'<section class="sec" id="([^"]+)".*?</section>', s, re.S)
blocks=re.findall(r'(<section class="sec" id="([^"]+)".*?</section>)', s, re.S)
sec_html={i:b for b,i in blocks}
page_of={}
PAGES=[
 ('index','Inicio',['explora','cero','examen','mapa']),
 ('t1','T1 · Introducción',['t1']),
 ('t2','T2 · Morfología',['t2']),
 ('t3','T3 · Matemáticas espaciales',['t3']),
 ('t4','T4 · Cinemática',['t4']),
 ('t5','T5 · Dinámica',['t5']),
 ('t6','T6 · Control',['t6']),
 ('demostraciones','Demostraciones',['demostraciones']),
 ('practicas','Prácticas',['practicas']),
 ('resueltos','Ejercicios resueltos',['resueltos']),
 ('diapositivas','Diapositivas',['diapositivas']),
 ('interactivos','Diagramas interactivos',['interactivos']),
 ('resolver','Resolver exámenes paso a paso',['resolver']),
 ('figuras','Figuras de los temas',['figuras']),
 ('animaciones','Animaciones',['animaciones']),
 ('calculadoras','Calculadoras',['calculadoras']),
 ('diapositivas-temario','Diapositivas por tema',['diapositivas-temario']),
 ('examenes','Exámenes de cursos anteriores',['practicar']),
 ('simulacros','Simulacros de examen',['simulacros']),
 ('autoevaluacion','Autoevaluación',['autoevaluacion']),
 ('formulario','Formulario',['formulario']),
 ('glosario','Glosario',['glosario']),
 ('plan','Plan de estudio',['plan']),
 ('bibliografia','Bibliografía',['bibliografia']),
]
for pg,title,ids in PAGES:
    for i in ids: page_of[i]=pg
missing=[i for i in secs if i not in page_of]
assert not missing, missing
nav=re.search(r'<nav.*?</nav>', s, re.S).group(0)
footer=re.search(r'<footer>.*?</footer>', s, re.S)
footer=footer.group(0) if footer else ''
hero=re.search(r'<header class="hero">.*?</header>', s, re.S).group(0)
script=re.search(r'<script>(.*?)</script>', s, re.S).group(1)
# simulador: sólo si existe su DOM
a=script.index('  /* --- simulador 2R plano --- */')
b=script.index('  dibujarFK();\n})();')+len('  dibujarFK();\n')
script=script[:a]+"  if(document.getElementById('s-t1')){\n"+script[a:b]+"  }\n"+script[b:]
script+='''
/* --- búsqueda global --- */
(function(){
  var box=document.getElementById('q-global'), res=document.getElementById('q-res');
  if(!box||!res) return;
  var idx=null;
  function cargar(cb){ if(idx) return cb(idx); fetch('search-index.json').then(function(r){return r.json()}).then(function(j){idx=j; cb(j)}).catch(function(){res.textContent='La búsqueda necesita abrir la guía desde su dirección web.'; res.hidden=false;}); }
  box.addEventListener('input',function(){
    var q=box.value.trim().toLowerCase();
    if(q.length<2){res.hidden=true; res.innerHTML=''; return;}
    cargar(function(j){
      var out=[];
      j.forEach(function(e){ if(e.text.toLowerCase().indexOf(q)>=0) out.push(e); });
      res.innerHTML = out.slice(0,12).map(function(e){return '<a href="'+e.url+'">'+e.title+'</a>'}).join('') || '<span>Sin resultados</span>';
      res.hidden=false;
    });
  });
})();
if('serviceWorker' in navigator){ try{ navigator.serviceWorker.register('sw.js'); }catch(e){} }
'''
def fix_links(frag):
    def rep(m):
        target=m.group(1)
        pg=page_of.get(target) or ('resueltos' if target.startswith('ej-') else None)
        if pg:
            return 'href="%s.html#%s"'%(pg,target)
        return m.group(0)
    return re.sub(r'href="#([^"]+)"', rep, frag)
def search_box():
    return ('<div class="gsearch" style="max-width:1100px;margin:12px auto 0;padding:0 16px">'
            '<input id="q-global" type="search" placeholder="Buscar en toda la guía…" aria-label="Buscar en toda la guía" style="width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--fg)">'
            '<div id="q-res" hidden class="qres"></div></div><style>#q-res[hidden],#q-res.qres[hidden]{display:none!important}#q-res.qres{display:flex;flex-direction:column;gap:4px;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:6px}#q-res a{color:var(--accent)}</style>')
index_entries=[]
for pg,title,ids in PAGES:
    body=''.join(sec_html[i] for i in ids)
    # enlaces internos de la página
    body=fix_links(body)
    body=body.replace('href="resueltos.html#','href="resueltos.html#')
    nav_f=fix_links(nav)
    h=fix_links(hero) if pg=='index' else ''
    page=('<!doctype html>\n<html lang="es">\n'+head.replace('{TITLE}', 'Sistemas Robotizados · '+title)+'\n</head>\n<body>\n'
          +'<div class="hub-bar" style="max-width:1100px;margin:0 auto;padding:10px max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px));display:flex;flex-wrap:wrap;gap:12px"><a class="hub-link" href="https://helionacon-ui.github.io/GIEIA-UPCT/" style="display:inline-flex;align-items:center;gap:6px;font:600 13.5px/1 system-ui,sans-serif;padding:8px 12px;border-radius:999px;border:1px solid var(--line);color:var(--fg);text-decoration:none;background:var(--surface)">← Guías para aprobar · GIEyA · UPCT</a></div>\n'
          +h+'\n'+search_box()+'\n<div class="wrap">\n'+nav_f+'\n<main>\n'+body+'\n</main>\n</div>\n'
          +footer+'\n<script>\n'+script+'\n</script>\n</body>\n</html>\n')
    open(os.path.join(OUT,pg+'.html'),'w',encoding='utf-8').write(page)
    # índice de búsqueda: un registro por sección con texto
    for i in ids:
        sb=sec_html[i]
        h2=re.search(r'<h2>(.*?)</h2>',sb,re.S)
        ttl=re.sub(r'<[^>]+>','',h2.group(1)) if h2 else title
        sb_txt=re.sub(r'<script.*?</script>|<style.*?</style>',' ',sb,flags=re.S)
        txt=re.sub(r'<[^>]+>',' ',sb_txt); txt=html.unescape(re.sub(r'\s+',' ',txt))
        index_entries.append({'title':ttl,'url':pg+'.html#'+i,'text':txt[:6000]})
# subregistros para los ejercicios resueltos (anclas por details)
rs=sec_html['resueltos']
for m in re.finditer(r'<details id="([^"]+)">\s*<summary>(.*?)</summary>(.*?)</details>', rs, re.S):
    txt=html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',m.group(3))))
    index_entries.append({'title':html.unescape(re.sub(r'<[^>]+>','',m.group(2))),'url':'resueltos.html#'+m.group(1),'text':txt[:6000]})
json.dump(index_entries, open(os.path.join(OUT,'search-index.json'),'w',encoding='utf-8'), ensure_ascii=False)
manifest={"name":"Sistemas Robotizados · Guía de estudio","short_name":"Robotizados","start_url":"./index.html","scope":"./","display":"standalone","background_color":"#fbf5ef","theme_color":"#b9561a","lang":"es","icons":[{"src":"icon.svg","sizes":"any","type":"image/svg+xml","purpose":"any maskable"}]}
json.dump(manifest, open(os.path.join(OUT,'manifest.webmanifest'),'w',encoding='utf-8'), ensure_ascii=False, indent=1)
open(os.path.join(OUT,'icon.svg'),'w',encoding='utf-8').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#b9561a"/><g stroke="#fff" stroke-width="34" stroke-linecap="round" fill="none"><path d="M150 380 L250 260 L370 300"/></g><circle cx="150" cy="380" r="40" fill="#fff"/><circle cx="250" cy="260" r="40" fill="#fff"/><circle cx="370" cy="300" r="34" fill="#fbe6d9"/></svg>')
ASSETS=[p[0]+'.html' for p in PAGES]+['manifest.webmanifest','icon.svg','search-index.json']
sw='''const VERSION = "robotizados-2026-11-09";
const ASSETS = %s;
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
''' % json.dumps(ASSETS)
open(os.path.join(OUT,'sw.js'),'w',encoding='utf-8').write(sw)
print('páginas:', len(PAGES), 'entradas búsqueda:', len(index_entries))
