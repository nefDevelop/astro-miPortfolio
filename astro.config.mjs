import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// URL publicada. La usan las etiquetas canónicas, el hreflang y og:url.
// neftad.vercel.app es el dominio real; neftali.dev no estaba registrado.
export default defineConfig({
  site: "https://neftad.vercel.app",
  integrations: [tailwind()],
  // Los bloques ```mermaid no son código a resaltar: sin excluirlos, Shiki los
  // envuelve en spans y el script del caso de estudio no encuentra el fuente
  // crudo para pasárselo a mermaid. 'math' ya viene por defecto.
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["math", "mermaid"],
    },
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true,
      // Sin redirect: la raíz sirve la versión en español para que quien teclee
      // el dominio no espere un salto. El canónico de esa página apunta a /es/.
      redirectToDefaultLocale: false,
    },
  },
});