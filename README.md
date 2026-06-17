# Portfolio - Neftalí

Este es mi portafolio personal construido con **Astro**, diseñado con un enfoque minimalista, funcional y totalmente responsive. El proyecto utiliza un sistema de internacionalización (i18n) para soportar contenido en español e inglés.

## 🚀 Tecnologías

- **[Astro](https://astro.build/)** - Framework web para la máxima velocidad.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS orientado a utilidades para un diseño rápido y flexible.
- **TypeScript** - Para un desarrollo más seguro y robusto.
- **Content Collections** - Gestión de proyectos y casos de estudio mediante archivos Markdown.
- **Makefile** - Automatización de tareas comunes (instalación, desarrollo, construcción).

## ✨ Características

- **Internacionalización (i18n):** Soporte nativo para español e inglés en toda la interfaz.
- **Diseño Mobile-First:** Optimizado para cualquier dispositivo.
- **Sección de Proyectos Dinámica:** Presentación detallada con diapositivas y casos de estudio.
- **Alto Rendimiento:** Aprovecha las islas de Astro y la generación de sitios estáticos (SSG).

## 📂 Estructura del Proyecto

```text
/
├── public/              # Archivos estáticos (favicons, etc.)
├── src/
│   ├── assets/          # Imágenes y recursos multimedia
│   ├── components/      # Componentes reutilizables de Astro
│   ├── content/         # Casos de estudio en Markdown (proyectos)
│   ├── data/            # Datos principales (portfolio.ts)
│   ├── i18n/            # Traducciones y configuración de idioma
│   ├── layouts/         # Plantillas base
│   └── pages/           # Rutas y páginas del sitio
├── Makefile             # Comandos abreviados
└── package.json         # Dependencias y scripts
```

## 🛠️ Comandos

Puedes usar `npm` o el `Makefile` incluido para gestionar el proyecto:

| Acción | Comando npm | Comando Make |
| :--- | :--- | :--- |
| Instalar dependencias | `npm install` | `make install` |
| Iniciar servidor de desarrollo | `npm run dev` | `make dev` |
| Construir para producción | `npm run build` | `make build` |
| Previsualizar construcción | `npm run preview` | `make preview` |
| Limpiar archivos temporales | - | `make clean` |

## ⚙️ Personalización

Para adaptar este portafolio a tus necesidades:

1.  **Información Personal:** Edita `src/data/portfolio.ts` para cambiar tu nombre, rol, redes sociales y lista de proyectos.
2.  **Traducciones:** Modifica `src/i18n/translations.ts` para ajustar los textos de la interfaz.
3.  **Proyectos:** Añade o edita archivos `.md` en `src/content/projects/` para los casos de estudio detallados.

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de usarlo como base para tu propio portafolio.

---

Desarrollado con ❤️ por **Neftalí** - [GitHub](https://github.com/nefDevelop) | [LinkedIn](https://www.linkedin.com/in/neftal%C3%AD-dom%C3%ADnguez-urda/)
