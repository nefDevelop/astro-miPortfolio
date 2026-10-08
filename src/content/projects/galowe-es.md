---
title: "Galo"
highlight: "we"
lang: "es"
route: "galowe"
order: 3
---

## El Desafío
Gestionar una biblioteca digital propia suele terminar dependiendo de un ordenador siempre encendido y de un ecosistema cerrado. Galowe parte de la idea contraria: una biblioteca que se pueda leer y sincronizar desde el navegador, pero también desde un **Kindle**, un **Kobo** o un **KOReader**, sin ceder los datos a servicios de terceros.

## Solución Técnica
Galowe es **Go desde cero** —no un fork de Calibre— con un servidor de sincronización integrado. Acepta catorce formatos de entrada y ocho de salida, y habla con cada lector por la vía que ese lector entiende.

### Puntos clave de la implementación
- **Motor de conversión propio:** 14 formatos de entrada × 8 de salida, con un **parser de MOBI y PalmDB escrito desde cero**, incluido el compresor PalmDOC.
- **KOSync nativo:** Implementa el protocolo estándar de KOReader y reimplementa en Go el `partialMD5` de muestreo rápido, de forma que la posición de lectura se comparte entre el lector web y el dispositivo.
- **Cuatro vías al Kindle:** Send-to-Kindle por **SMTP**, conexión **USB/MTP** mediante `gio copy`, un portal E-Ink y **KOSync**.
- **Portal E-Ink sin JavaScript:** HTML y CSS puros con paginación resuelta en el servidor, pensado para el navegador experimental del Kindle y pantallas de alto contraste.
- **Lector web integrado:** **Foliate.js** con cinco temas y cuatro tipografías, OpenDyslexic incluida, más búsqueda dentro del libro.
- **PDF con Typst:** Motor Typst compilado a **WebAssembly** para generar PDF sin dependencias externas.

### Resultado
85.570 líneas en total —31.100 de Go de producción y 27.614 de Svelte—, **153 endpoints HTTP** y un **63 % de cobertura en Go**, con 548 tests, 8 funciones de fuzz y 20 benchmarks. Incluye un importador del `metadata.db` de Calibre y un shim de compatibilidad con Readarr.

## Aprendizaje
Galowe me obligó a bajar hasta el formato de fichero: escribir un parser de MOBI y su compresor enseña que un libro no es más que una estructura de bloques con una especificación detrás. Y reimplementar el hash de KOReader demostró que la interoperabilidad real no se consigue leyendo la documentación, sino haciendo que los números coincidan con los del otro motor.
