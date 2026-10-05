# Portfolio — Neftalí

Portfolio construido como un **manual de ingeniería**: papel crema, tinta verde bosque y un
único acento ámbar reservado para el punto del título.

> El diseño anterior está archivado en `.tmp/old/` para referencia; está dentro de `.tmp/`,
> que el `.gitignore` excluye.

## Concepto

- **Dos temas, una sola variable por color.** Los tokens viven en `src/styles/global.css`;
  la clase `dark` la fija un script del `<head>` antes del primer paint, así que no hay
  destello al cambiar de tema ni al recargar.
- **Papel, tinta y rejilla.** Las capturas se enmarcan como *láminas* sobre papel crema. La
  rejilla fina del hero es textura, no decoración.
- **El punto característico** sigue siendo la única pieza de identidad: vuela y aterriza en
  700 ms sobre la rejilla, sin overlay y sin bloquear el scroll.
- **Cero gates.** No hay splash, ni scroll-jacking, ni `canvas`. El contenido nunca depende
  de JavaScript para ser visible: sin JS se lee igual, solo que sin animaciones. La única
  excepción son los diagramas Mermaid de los casos de estudio: sin JS se ve el código fuente
  del diagrama, que se lee aunque no se dibuje.

## Estructura

```text
src/
├── assets/          # Imágenes (se optimizan a WebP en build)
├── components/      # Nav, Hero, Projects, About, Background, Contact, Footer, Home
├── content/         # Casos de estudio en Markdown (uno por idioma)
├── data/            # portfolio.ts: datos personales, stack, proyectos, trayectoria
├── i18n/            # translations.ts: todo el texto de la interfaz
├── layouts/         # Layout.astro: head, metadatos, tema
├── pages/
│   ├── index.astro          # Raíz: sirve la versión ES (canónico → /es/)
│   ├── 404.astro
│   └── [lang]/              # /es/ y /en/
│       ├── index.astro
│       └── projects/[slug].astro
└── styles/          # global.css (tokens) + fonts.ts
```

## Rutas

| Ruta | Contenido |
| :--- | :--- |
| `/` | Home en español (canónico apunta a `/es/`) |
| `/es/`, `/en/` | Home en cada idioma |
| `/es/projects/recipenode/` | Caso de estudio |
| `/en/projects/regio/` | Caso de estudio |

El cambio de idioma conserva la ruta actual. Cada página declara `canonical` y `hreflang`
para los tres valores (`es`, `en`, `x-default`).

## Comandos

| Acción | npm | Make |
| :--- | :--- | :--- |
| Instalar | `npm install` | `make install` |
| Desarrollo | `npm run dev` | `make dev` |
| Build | `npm run build` | `make build` |
| Vista previa | `npm run preview` | `make preview` |
| Pruebas | `npm test` | `make test` |
| Solo unitarias | — | `make test-unit` |
| Controles negativos | — | `make test-controls` |

## Pruebas

`tests/` contiene la batería: **18 pruebas** (4 unitarias, 11 de integración y
3 controles negativos), con `make test` y tres targets granulares.

- **Unitarias** (`test-unit`): geometría de la salida de las letras, física del
  morph, orden del DOM, cierre continuo. No necesitan `dist/`.
- **Integración** (`test-build`, depende de `build`): ejecutan el bundle
  compilado contra un DOM mínimo. Cubren la continuidad de las animaciones, la
  recogida de la etiqueta en la barra, la selección de la sección, el tema, los
  enlaces internos, el solape entre letras al morphear, que toda utilidad
  `hover:`/`focus-visible:` existe en el CSS y que los bloques ```` ```mermaid ````
  llegan crudos al HTML sin resaltar.
- **Controles negativos** (`test-controls`): patchean una copia del bundle para
  reintroducir cada defecto (caída vertical, desvanecido instantáneo,
  apilamiento, salida lineal que provoca solape y ventana de tema que no se
  cierra) y comprueban que el test correspondiente
  **lo detecta**. Sin esto un verde no prueba nada.

No hay frameworks de test: son scripts de `node`. `_escenario.mjs` construye el
DOM mínimo y lo comparten `salida.mjs` y `solape.mjs`; `_raiz.mjs` resuelve las
rutas y deja apuntar la batería a otra copia con `RAIZ`/`NAV_BUNDLE`, que es lo
que usan los controles.

## Antes de publicar

- [x] `site` en `astro.config.mjs` → `https://neftad.vercel.app` (canónicos, hreflang y og:url).
- [ ] Crear una imagen `og:image` de 1200×630 (ahora se usa la foto de perfil).
- [ ] Desplegar una demo y rellenar `demo` en `portfolio.ts`; el campo existe y
      el botón `liveDemo` sale solo si tiene valor.
- [ ] Decidir la captura de cabecera de reGIO: `regio-main.png` es la pantalla de login.
      Hay 5 capturas sin usar en `src/assets/` (`regio-admin-2/3`, `regio-profile-1/2/3`).