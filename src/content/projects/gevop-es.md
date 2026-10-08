---
title: "Ge"
highlight: "vop"
lang: "es"
route: "gevop"
order: 4
---

## El Desafío
Un IDE es el programa que más tiempo pasa abierto frente a un desarrollador y, a la vez, uno de los más difíciles de escribir: necesita hablar con servidores de lenguaje, con depuradores, con Git y con una terminal real, sin bloquearse nunca. Gevop se propuso hacerlo en **Go**, con un único binario que funcionara igual de bien en el escritorio que en el navegador.

## Solución Técnica
Gevop separa estrictamente dominio, casos de uso e infraestructura. El mismo binario arranca como aplicación de escritorio con **Wails** o como servidor web al pasar un flag, de modo que la lógica es idéntica en los dos modos y la interfaz solo cambia de transporte.

### Puntos clave de la implementación
- **Plugins como procesos aislados:** Las extensiones corren en procesos independientes y se comunican por **JSON-RPC 2.0** sobre stdin/stdout. Un plugin que falla no tumba el IDE y puede estar escrito en cualquier lenguaje.
- **Inteligencia de código:** Soporte **LSP** completo (completado, definición, hover, rename, semantic tokens) y **DAP** para la depuración.
- **Terminal integrada:** PTY real con soporte UTF-8 y redimensionado fluido.
- **Seguridad:** Protección anti *path traversal*, escaneo de secretos y espacios de trabajo de confianza.
- **Historial local:** Recupera versiones anteriores de cualquier archivo mediante snapshots por deltas firmados con **SHA-256** y una retención de 50 versiones.
- **Interfaz:** 58 componentes Svelte y cuatro temas, uno de ellos replicando **VS Code Dark+** token a token.

### Resultado
82 ficheros de test de Go con **252 tests y 17 benchmarks**, más 28 ficheros de test de frontend con 450 aserciones. La integración continua tiene seis trabajos con umbrales bloqueantes: cobertura total ≥ 50 %, `domain` ≥ 85 % y `delivery/httpserver` ≥ 70 %, con `govulncheck` bloqueante y `gosec` como informe con baseline documentado.

## Aprendizaje
Escribir un IDE enseña que la parte difícil no es dibujar el editor, sino coordinarlo todo sin que una tarea lenta congele el resto: cada lenguaje, cada depurador y cada terminal es un proceso con el que hay que negociar. El aislamiento de plugins por procesos fue la decisión que más simplificó el diseño y la que mejor resistió los fallos.
