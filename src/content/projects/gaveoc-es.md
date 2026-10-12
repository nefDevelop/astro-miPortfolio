---
title: "Gave"
highlight: "oc"
lang: "es"
route: "gaveoc"
order: 2
---

## El Desafío
La web es efímera: un artículo que hoy enlazas mañana ya no existe. Guardar la página no basta si solo se conserva el HTML sin sus recursos, ni si el resultado es ilegible o imposible de buscar. El objetivo de **Gaveoc** fue construir un archivador autoalojado que conservara la página tal y como se vio y, a la vez, la convirtiera en un documento limpio, buscable y anotable.

## Solución Técnica
Un único binario de Go sirve el backend y el frontend. La captura combina **Obelisk** (descarga la página con su CSS, su JavaScript y sus imágenes) y **Readability** (extrae el artículo limpio), y todo el contenido se indexa en **SQLite con FTS5** para la búsqueda de texto completo.

### Arquitectura y capacidades
- **Clean Architecture y DDD:** El árbol separa `domain`, `application`, `adapters` e `infrastructure`. Los casos de uso no conocen ni la base de datos ni la interfaz, que es lo que permite sostener varias superficies de entrega sobre un mismo núcleo.
- **Cuatro superficies:** Una sola base de código se entrega como SPA con **SvelteKit 5**, PWA instalable, aplicación Android mediante **Capacitor** y extensión de navegador **MV3**.
- **Organización y búsqueda:** Índice FTS5 sobre el texto extraído, con etiquetas, colecciones y reglas de etiquetado automático.
- **Procesado pesado en segundo plano:** OCR con **Tesseract** y `pdftoppm` sobre una cola de workers con reintentos, para indexar también PDF y documentos escaneados.
- **Portabilidad:** Exportación a ePub, PDF (vía **Typst**), Markdown con front-matter YAML y marcadores Netscape.
- **Interfaz:** Material You 3 y Adwaita, modo claro y oscuro, esqueletos de carga y avisos.

### Resultado
El despliegue se reduce a un binario y una base de datos SQLite, con API documentada en Swagger.

## Aprendizaje
Gaveoc fue el proyecto donde la separación por capas dejó de ser teoría. Mantener cuatro superficies de entrega sobre un mismo núcleo obliga a que el dominio no dependa de ninguna de ellas, y a que todo lo específico de cada plataforma viva en su adaptador. La parte más costosa no fue archivar, sino conseguir que lo archivado siguiera siendo legible.
