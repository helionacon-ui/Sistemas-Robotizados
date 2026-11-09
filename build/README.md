# Cómo se construye la guía

La **fuente** es un único archivo: `descargas/Guia_estudio_Sistemas_Robotizados.html`.
Todo lo demás (las páginas de la web y los dos PDF) se genera a partir de él.
Si quieres cambiar algo, edita esa fuente y vuelve a generar.

## Lo que hace falta

- Python 3 con `pypdf`
- Node con Playwright y Chromium
- `pdftotext` (del paquete poppler), que usa el script de marcadores

## Generar la web

    python3 build/mksite.py

Escribe en la raíz del repositorio una página por sección, el índice de búsqueda
(`search-index.json`), el manifiesto de la aplicación y el service worker.
Las secciones y su reparto en páginas están en la lista `PAGES`, dentro del script.

## Generar los PDF

    node build/pdfs.js        # imprime la guía y los ejercicios resueltos
    python3 build/outline.py  # les añade los marcadores

Los dos PDF quedan en `descargas/`. El primer script abre todos los desplegables
antes de imprimir, para que en el papel salga el contenido completo.

## Comprobar que no se ha roto nada

    python3 -m http.server 8765 &     # desde la raíz del repositorio
    node build/webtest.js

Comprueba que no hay enlaces rotos, que no aparece scroll horizontal a 390 px de
ancho, que no hay errores de JavaScript, que el buscador responde y que el
service worker se registra.

## Nota

La guía vive en dos sitios: este repositorio y la carpeta `sistemas-robotizados/`
del repositorio `GIEIA-UPCT`. Si cambias algo, acuérdate de copiarlo a los dos.
