export const ui = {
  es: {
    meta: {
      title: "Neftalí Domínguez — Desarrollador Full Stack Junior",
      description:
        "Desarrollador Full Stack Junior (TypeScript, Node.js, Go, Svelte, Astro) buscando prácticas en empresa. Cuatro proyectos con caso de estudio: seguridad, archivado web, biblioteca digital y un gestor de contraseñas.",
      siteName: "Neftalí Domínguez",
    },
    nav: {
      about: "Sobre mí",
      background: "Trayectoria",
      projects: "Proyectos",
      contact: "Contacto",
      menu: "Menú",
      theme: "Cambiar entre modo día y noche",
      skipToContent: "Ir al contenido",
      // La etiqueta nombra el cambio al OTRO idioma y va en el idioma de la
      // página actual: en /es/ el botón lleva a /en/, así que anuncia "cambiar
      // a inglés". Es un string y no un mapa por clave porque cada página solo
      // tiene un destino (los dos idiomas); con el mapa, tres de las cuatro
      // entradas eran inalcanzables y las que se leían anunciaban lo contrario.
      switchLang: "Cambiar a inglés",
      label: {
        home: "Neftalí Domínguez — inicio",
        role: "Desarrollador Full Stack Junior",
        about: "Sobre mí",
        background: "Trayectoria",
        contact: "Contacto",
      },
    },
    hero: {
      available: "Buscando prácticas",
      role: "Desarrollador Full Stack Junior",
      goal: "Buscando prácticas en empresa donde contribuir a producto real.",
      ctaProjects: "Ver proyectos",
      ctaContact: "Escribirme",
    },
    about: {
      title: "Sobre mí",
      stack: "Stack principal",
      // Solo se traducen las etiquetas de grupo: los nombres de tecnica son
      // los mismos en los dos idiomas y viven en portfolio.ts.
      stackLabels: {
        langs: "Lenguajes",
        frontend: "Frontend",
        data: "Bases de datos",
        ops: "Contenedores y sistemas",
      },
      languages: {
        title: "Idiomas",
        items: [
          { name: "Inglés", level: "B2", note: "Certificación oficial APTIS ESOL" },
          { name: "Español", level: "Nativo", note: "" },
        ],
      },
    },
    background: {
      title: "Trayectoria",
      jobs: "Experiencia",
      education: "Formación",
      certifications: "Certificaciones",
    },
    projects: {
      title: "Proyectos",
      others: "Otros proyectos",
      subtitle:
        "Cuatro proyectos completos, de principio a fin. Cada uno tiene su caso de estudio con el problema, las decisiones técnicas y lo que aprendí.",
      caseStudy: "Caso de estudio",
      back: "Volver al inicio",
      viewRepo: "Repositorio",
      liveDemo: "Demo en vivo",
      details: "Detalles",
      roleLabel: "Rol",
      roleValue: "Desarrollo individual",
    },
    contact: {
      title: "Contacto",
      body: "Si buscas un perfil junior que venga con las manos en la masa, escríbeme. Respondo siempre.",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      builtWith: "Diseñado y construido por",
    },
    notFound: {
      title: "Página no encontrada",
      desc: "Esta dirección no lleva a ningún sitio. El enlace puede estar mal escrito o la página se ha movido.",
      back: "Volver al inicio",
    },
  },
  en: {
    meta: {
      title: "Neftalí Domínguez — Junior Full Stack Developer",
      description:
        "Junior Full Stack Developer (TypeScript, Node.js, Go, Svelte, Astro) looking for an internship. Four projects with case studies: security, web archiving, a digital library and a password manager.",
      siteName: "Neftalí Domínguez",
    },
    nav: {
      about: "About",
      background: "Background",
      projects: "Projects",
      contact: "Contact",
      menu: "Menu",
      theme: "Toggle light and dark mode",
      skipToContent: "Skip to content",
      switchLang: "Switch to Spanish",
      label: {
        home: "Neftalí Domínguez — home",
        role: "Junior Full Stack Developer",
        about: "About me",
        background: "Background",
        contact: "Contact",
      },
    },
    hero: {
      available: "Looking for an internship",
      role: "Junior Full Stack Developer",
      goal: "Looking for an internship where I can contribute to a real product.",
      ctaProjects: "View projects",
      ctaContact: "Email me",
    },
    about: {
      title: "About me",
      stack: "Main stack",
      stackLabels: {
        langs: "Programming languages",
        frontend: "Frontend",
        data: "Databases",
        ops: "Containers and systems",
      },
      languages: {
        title: "Languages",
        items: [
          { name: "English", level: "B2", note: "Official APTIS ESOL certificate" },
          { name: "Spanish", level: "Native", note: "" },
        ],
      },
    },
    background: {
      title: "Background",
      jobs: "Experience",
      education: "Education",
      certifications: "Certifications",
    },
    projects: {
      title: "Projects",
      others: "Other projects",
      subtitle:
        "Four complete projects, built end to end. Each one has a case study covering the problem, the technical decisions and what I learned.",
      caseStudy: "Case study",
      back: "Back to home",
      viewRepo: "Repository",
      liveDemo: "Live demo",
      details: "Details",
      roleLabel: "Role",
      roleValue: "Solo development",
    },
    contact: {
      title: "Contact",
      body: "If you are looking for a junior profile who ships, get in touch. I always reply.",
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "Designed and built by",
    },
    notFound: {
      title: "Page not found",
      desc: "This address does not lead anywhere. The link may be mistyped or the page has moved.",
      back: "Back to home",
    },
  },
} as const;

export type Locale = keyof typeof ui;