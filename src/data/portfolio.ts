import type { ImageMetadata } from "astro";
import type { Locale } from "../i18n/translations";

// Destacados.
import regioMain from "../assets/regio-main.png";
import regio2fa from "../assets/regio-2fa.png";
import regioBridges from "../assets/regio-bridges.png";
import regioAdmin1 from "../assets/regio-admin-1.png";
import gaveocMain from "../assets/gaveoc-main.png";
import gaveocMainDark from "../assets/gaveoc-main-darkmode.png";
import gaveocDetails from "../assets/gaveoc-document-details.png";
import gaveocProcess from "../assets/gaveoc-document-process-darkmode.png";
import galoweMain from "../assets/galowe-main.png";
import galoweExports from "../assets/galowe-exports.png";
import galoweBookSend from "../assets/galowe-book-send.png";
import galoweEink from "../assets/galowe-eink.png";

// Rejilla.
import recipeNodeMain from "../assets/recipeNode-main.png";
import pactMainAdvance from "../assets/pact-main-advance.png";
import pactMainSimple from "../assets/pact-main-simple.png";
import pactDetails from "../assets/pact-details.png";
import pactSettings from "../assets/pact-settings.png";
import sgoundImageMain from "../assets/sgound-main.png";
import gorrsonMain from "../assets/gorrson-main.png";
import plannsHero from "../assets/planns-main.png";
import ggitMain from "../assets/ggit-main.png";

export const personalInfo = {
  name: "Neftalí",
  fullName: "Neftalí Domínguez",
  location: "Málaga, España",
  email: "nefdevelop@gmail.com",
  social: {
    github: "https://github.com/nefDevelop",
    linkedin: "https://www.linkedin.com/in/neftal%C3%AD-dom%C3%ADnguez-urda/",
  },
};

// Posicionamiento: es la frase que un reclutador lee en los primeros 6 segundos,
// así que vive en los datos y no en la plantilla.
export const positioning = {
  stack: ["TypeScript", "Node.js", "Go", "Svelte", "Astro"],
};

/**
 * Sobre mí y trayectoria, con texto por idioma. Mismo patrón que `projects`:
 * la presentación vive en los datos y los componentes eligen con `lang`.
 * Antes todo estaba solo en español, así que en `/en/` estas dos secciones
 * se leían en español.
 */
export const about: Record<Locale, { description_1: string; description_2: string }> = {
  es: {
    description_1:
      "Técnico Superior en Desarrollo de Aplicaciones Web. Me centro en el lado full stack: interfaces que se sienten bien y servicios que se sostienen.",
    description_2:
      "Trabajo con el principio KISS, con accesibilidad por defecto y sin capas innecesarias. Me interesa especialmente el desarrollo web con SvelteKit y Astro y el crecimiento de bases de código que otras personas tienen que mantener.",
  },
  en: {
    description_1:
      "Higher Technician in Web Application Development. I focus on the full stack: interfaces that feel good and services that hold up.",
    description_2:
      "I work by the KISS principle, with accessibility by default and no unnecessary layers. I am especially interested in web development with SvelteKit and Astro, and in growing codebases that other people have to maintain.",
  },
};

/**
 * Stack agrupado, como en el CV. Los nombres de tecnica no cambian entre
 * idiomas; las etiquetas de grupo viven en i18n.
 *
 * Antes eran 9 etiquetas planas en About. Aqui entran 17: un reclutador busca
 * "Docker" o "PostgreSQL" por palabras clave y no las encontraba en la web.
 */
export const skillGroups: { key: string; items: string[] }[] = [
  {
    key: "langs",
    items: ["Golang", "JavaScript", "TypeScript", "Python", "C#", "Java"],
  },
  {
    key: "frontend",
    items: ["Svelte", "Astro", "Tailwind CSS"],
  },
  {
    key: "data",
    items: ["SQLite", "PostgreSQL", "MySQL"],
  },
  {
    key: "ops",
    items: ["Docker", "Podman", "Linux (Debian/Fedora)", "Git", "Bash"],
  },
];

export interface Entry {
  title: string;
  /** El segundo bloque del CV no nombra empresa, así que no es obligatorio. */
  place?: string;
  period: string;
  desc?: string;
  /** Puntos del CV que no entran en un solo párrafo. */
  bullets?: string[];
}

/**
 * Experiencia profesional previa a la reorientación al sector técnico, tal
 * como aparece en el CV. Se muestra como trayectoria, no como experiencia
 * técnica: los 17 años justifican el método y la resistencia a la presión,
 * no el stack.
 */
export const experience: Record<Locale, Entry[]> = {
  es: [
    {
      title: "Auxiliar de Servicios y Control de Convivencia",
      place: "C.I.M.I. La Marchenilla",
      period: "2004 — 2021",
      desc: "Supervisión del entorno residencial y cumplimiento de protocolos organizativos, con funciones de responsabilidad sobre el recinto y el equipo.",
      bullets: [
        "Control de las instalaciones para mantener un entorno seguro para usuarios y equipo.",
        "Gestión de incidencias, alarmas y mediación en conflictos, con respuesta calmada bajo presión según la normativa interna.",
        "Colaboración en el orden y la rutina diaria del centro.",
      ],
    },
    {
      title: "Mantenimiento y Servicios Generales",
      period: "2003",
      desc: "Resolución autónoma de incidencias técnicas, reparaciones básicas y mantenimiento operativo en entorno residencial.",
    },
  ],
  en: [
    {
      title: "Services and Conduct Assistant",
      place: "C.I.M.I. La Marchenilla",
      period: "2004 — 2021",
      desc: "Supervision of the residential environment and compliance with organisational protocols, with responsibility for the premises and the team.",
      bullets: [
        "Facility oversight to keep a safe environment for residents and staff.",
        "Handling incidents, alarms and conflict mediation, with a calm response under pressure according to internal policy.",
        "Supporting the daily order and routine of the centre.",
      ],
    },
    {
      title: "Maintenance and General Services",
      period: "2003",
      desc: "Independent resolution of technical issues, basic repairs and operational maintenance in a residential environment.",
    },
  ],
};

export const education: Record<Locale, Entry[]> = {
  es: [
    {
      title: "Grado Superior en Desarrollo de Aplicaciones Web",
      place: "Ilerna",
      period: "2024 — 2026",
      desc: "Formación técnica en desarrollo web full stack: bases de datos, integración de APIs, despliegue y aplicaciones multiplataforma.",
    },
  ],
  en: [
    {
      title: "Higher Degree in Web Application Development",
      place: "Ilerna",
      period: "2024 — 2026",
      desc: "Technical training in full stack web development: databases, API integration, deployment and cross-platform applications.",
    },
  ],
};

export const certifications: Record<Locale, Entry[]> = {
  es: [
    {
      title: "Formación avanzada de Backend: Python, Flask y Django",
      place: "IBM SkillsBuild",
      period: "2025",
      desc: "Arquitectura web, bases de datos, testing automatizado y escalabilidad.",
    },
  ],
  en: [
    {
      title: "Advanced Backend Training: Python, Flask and Django",
      place: "IBM SkillsBuild",
      period: "2025",
      desc: "Web architecture, databases, automated testing and scalability.",
    },
  ],
};

export interface Slide {
  title: string;
  desc: string;
  image: string | ImageMetadata;
  imageAlt?: string;
  imagePosition?: string;
  tags?: string[];
}

export interface Project {
  slug: string;
  title: string;
  highlight: string;
  type: string;
  desc: string;
  stack: string[];
  image: string | ImageMetadata;
  imageAlt?: string;
  imagePosition?: string;
  github?: string;
  /** URL de la demo. Vacío hasta que el proyecto esté desplegado. */
  demo?: string;
  slides: Slide[];
}

const projectsEs: Project[] = [
  {
    slug: "regio",
    title: "re",
    highlight: "GIO",
    type: "01 / Reverse Proxy",
    desc: "Reverse proxy ligero en Go para proteger servicios internos con autenticación centralizada y medidas de seguridad activas.",
    stack: ["Go", "AES-256-GCM", "TOTP", "Fail2Ban"],
    image: regioMain,
    imageAlt: "Interfaz de inicio de sesión de reGIO.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/regio",
    slides: [
      {
        title: "Doble factor",
        desc: "Autenticación en dos pasos con TOTP y secretos cifrados en reposo mediante AES-256-GCM.",
        image: regio2fa,
        imageAlt: "Configuración de autenticación en dos pasos de reGIO.",
        imagePosition: "object-top",
        tags: ["Go", "AES-256", "TOTP"],
      },
      {
        title: "Mitigación activa",
        desc: "Fail2Ban integrado a nivel de red, y protección frente a ataques de DNS rebinding y SSRF hacia servicios críticos.",
        image: regioBridges,
        imageAlt: "Panel de administración de redes y puentes de reGIO.",
        imagePosition: "object-top",
        tags: ["Security", "Network", "Fail2Ban"],
      },
      {
        title: "Panel de control",
        desc: "Gestión centralizada de servicios, políticas CSP dinámicas y auditoría inalterable de eventos en tiempo real.",
        image: regioAdmin1,
        imageAlt: "Vista del panel de administración de reGIO.",
        imagePosition: "object-top",
      },
    ],
  },
  {
    slug: "gaveoc",
    title: "Gave",
    highlight: "oc",
    type: "02 / Archivador Web",
    desc: "Archivador web autoalojado que guarda páginas con fidelidad, las limpia con Readability, las indexa con FTS5 y las sirve desde un único binario.",
    stack: ["Go", "SvelteKit", "SQLite FTS5", "Clean Architecture"],
    image: gaveocMain,
    imageAlt: "Biblioteca de artículos de Gaveoc.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/gaveoc",
    slides: [
      {
        title: "Cuatro superficies",
        desc: "Una sola base de código se entrega como SPA con SvelteKit 5, PWA instalable, app de Android vía Capacitor y extensión de navegador MV3.",
        image: gaveocMainDark,
        imageAlt: "Biblioteca de Gaveoc en modo oscuro.",
        imagePosition: "object-top",
        tags: ["SvelteKit", "PWA", "Capacitor"],
      },
      {
        title: "Archivado e índice",
        desc: "Obelisk descarga la página con todos sus recursos y Readability extrae el artículo limpio; SQLite con FTS5 resuelve la búsqueda de texto completo.",
        image: gaveocDetails,
        imageAlt: "Vista de lectura de un artículo archivado en Gaveoc.",
        imagePosition: "object-top",
        tags: ["SQLite FTS5", "Readability"],
      },
      {
        title: "Procesado asíncrono",
        desc: "OCR con Tesseract y pdftoppm sobre una cola de workers con reintentos, para indexar también documentos escaneados.",
        image: gaveocProcess,
        imageAlt: "Documentos de Gaveoc con extracción de texto en curso.",
        imagePosition: "object-top",
        tags: ["OCR", "Workers"],
      },
    ],
  },
  {
    slug: "galowe",
    title: "Galo",
    highlight: "we",
    type: "03 / Biblioteca Digital",
    desc: "Gestor de biblioteca digital que también actúa como servidor de sincronización para e-readers: Kindle, Kobo y KOReader.",
    stack: ["Go", "SvelteKit", "SQLite", "Foliate.js"],
    image: galoweMain,
    imageAlt: "Biblioteca principal de Galowe con lectura en curso y novedades.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/galowe",
    slides: [
      {
        title: "Conversión propia",
        desc: "Motor de conversión con 11 formatos de entrada y 7 de salida, y un parser de MOBI y PalmDB escrito desde cero, compresor PalmDOC incluido.",
        image: galoweExports,
        imageAlt: "Diálogo de conversión de Galowe a AZW3 con formatos de salida.",
        imagePosition: "object-top",
        tags: ["MOBI", "PalmDOC", "EPUB"],
      },
      {
        title: "Sincronización real",
        desc: "Servidor KOSync nativo con el partialMD5 de KOReader reimplementado en Go, para que web y dispositivo compartan la posición exacta de lectura.",
        image: galoweBookSend,
        imageAlt: "Ficha de libro de Galowe con envío a Kindle conectado.",
        imagePosition: "object-top",
        tags: ["KOSync", "KOReader"],
      },
      {
        title: "Cuatro vías al Kindle",
        desc: "Send-to-Kindle por SMTP, USB/MTP, un portal E-Ink sin JavaScript y KOSync, además de un lector Foliate.js con cinco temas y OpenDyslexic.",
        image: galoweEink,
        imageAlt: "Portal E-Ink de Galowe con descargas para Kindle.",
        imagePosition: "object-top",
        tags: ["SMTP", "E-Ink", "USB"],
      },
    ],
  },
  {
    slug: "pact",
    title: "Pact",
    highlight: "",
    type: "04 / Gestor de contraseñas",
    desc: "Gestor de contraseñas de escritorio con cifrado de extremo a extremo en el cliente: el servidor nunca llega a ver la clave maestra.",
    stack: ["Tauri v2", "Rust", "Svelte 5", "Argon2id"],
    image: pactMainAdvance,
    imageAlt: "Gestor de Pact con carpetas, lista y detalle.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/Pact",
    slides: [
      {
        title: "Acceso rápido",
        desc: "Sesión activa, buscador y tarjetas con iconos de marca: la cuenta que buscas a dos clics, con su código TOTP a la vista.",
        image: pactMainSimple,
        imageAlt: "Vista de acceso rápido de Pact.",
        imagePosition: "object-top",
        tags: ["Svelte 5", "TOTP"],
      },
      {
        title: "Gestor completo",
        desc: "Carpetas con el nombre cifrado, favoritos y papelera; cada cuenta guarda usuario, contraseña y semilla TOTP generada en local.",
        image: pactDetails,
        imageAlt: "Lista de cuentas de Pact con carpetas y favoritos.",
        imagePosition: "object-top",
        tags: ["Tauri v2", "Argon2id"],
      },
      {
        title: "Bóveda local o remota",
        desc: "La bóveda vive en un archivo .pact o en MariaDB; en ambos casos el servidor solo guarda blobs cifrados que no puede leer.",
        image: pactSettings,
        imageAlt: "Ajustes de bóveda de Pact: local o remota.",
        imagePosition: "object-top",
        tags: ["SQLite", "MariaDB"],
      },
    ],
  },
];

const projectsEn: Project[] = [
  {
    slug: "regio",
    title: "re",
    highlight: "GIO",
    type: "01 / Reverse proxy",
    desc: "A lightweight reverse proxy in Go that protects internal services with centralized authentication and active security measures.",
    stack: ["Go", "AES-256-GCM", "TOTP", "Fail2Ban"],
    image: regioMain,
    imageAlt: "reGIO login screen.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/regio",
    slides: [
      {
        title: "Two-factor auth",
        desc: "Two-step authentication with TOTP and secrets encrypted at rest using AES-256-GCM.",
        image: regio2fa,
        imageAlt: "Two-factor authentication setup in reGIO.",
        imagePosition: "object-top",
        tags: ["Go", "AES-256", "TOTP"],
      },
      {
        title: "Active mitigation",
        desc: "Network-level Fail2Ban, plus protection against DNS rebinding and SSRF attacks towards critical services.",
        image: regioBridges,
        imageAlt: "Network and bridge administration panel of reGIO.",
        imagePosition: "object-top",
        tags: ["Security", "Network", "Fail2Ban"],
      },
      {
        title: "Control panel",
        desc: "Centralised service management, dynamic CSP policies and an unalterable audit trail of events in real time.",
        image: regioAdmin1,
        imageAlt: "reGIO administration panel.",
        imagePosition: "object-top",
      },
    ],
  },
  {
    slug: "gaveoc",
    title: "Gave",
    highlight: "oc",
    type: "02 / Web archiver",
    desc: "A self-hosted web archiver that saves pages with full fidelity, cleans them with Readability, indexes them with FTS5 and serves them from a single binary.",
    stack: ["Go", "SvelteKit", "SQLite FTS5", "Clean Architecture"],
    image: gaveocMain,
    imageAlt: "Gaveoc article library.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/gaveoc",
    slides: [
      {
        title: "Four delivery surfaces",
        desc: "A single codebase ships as a SvelteKit 5 SPA, an installable PWA, an Android app through Capacitor and an MV3 browser extension.",
        image: gaveocMainDark,
        imageAlt: "Gaveoc library in dark mode.",
        imagePosition: "object-top",
        tags: ["SvelteKit", "PWA", "Capacitor"],
      },
      {
        title: "Archiving and index",
        desc: "Obelisk fetches the page with all its assets and Readability extracts the clean article; SQLite with FTS5 powers full-text search.",
        image: gaveocDetails,
        imageAlt: "Reading view of an archived article in Gaveoc.",
        imagePosition: "object-top",
        tags: ["SQLite FTS5", "Readability"],
      },
      {
        title: "Asynchronous pipeline",
        desc: "OCR through Tesseract and pdftoppm on a worker queue with retries, so scanned documents get indexed too.",
        image: gaveocProcess,
        imageAlt: "Gaveoc documents with text extraction in progress.",
        imagePosition: "object-top",
        tags: ["OCR", "Workers"],
      },
    ],
  },
  {
    slug: "galowe",
    title: "Galo",
    highlight: "we",
    type: "03 / Digital library",
    desc: "A digital library manager that also acts as a sync server for e-readers: Kindle, Kobo and KOReader.",
    stack: ["Go", "SvelteKit", "SQLite", "Foliate.js"],
    image: galoweMain,
    imageAlt: "Galowe main library with continue reading and new arrivals.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/galowe",
    slides: [
      {
        title: "In-house conversion",
        desc: "A conversion engine with 11 input and 7 output formats, plus a MOBI and PalmDB parser written from scratch, PalmDOC compressor included.",
        image: galoweExports,
        imageAlt: "Galowe conversion dialog to AZW3 with output formats.",
        imagePosition: "object-top",
        tags: ["MOBI", "PalmDOC", "EPUB"],
      },
      {
        title: "Real synchronisation",
        desc: "A native KOSync server with KOReader's partialMD5 reimplemented in Go, so the web reader and the device share the exact reading position.",
        image: galoweBookSend,
        imageAlt: "Galowe book details with send to connected Kindle.",
        imagePosition: "object-top",
        tags: ["KOSync", "KOReader"],
      },
      {
        title: "Four ways to the Kindle",
        desc: "Send-to-Kindle over SMTP, USB/MTP, a JavaScript-free E-Ink portal and KOSync, plus a Foliate.js reader with five themes and OpenDyslexic.",
        image: galoweEink,
        imageAlt: "Galowe E-Ink portal with Kindle downloads.",
        imagePosition: "object-top",
        tags: ["SMTP", "E-Ink", "USB"],
      },
    ],
  },
  {
    slug: "pact",
    title: "Pact",
    highlight: "",
    type: "04 / Password manager",
    desc: "A desktop password manager with end-to-end encryption on the client: the server never gets to see the master key.",
    stack: ["Tauri v2", "Rust", "Svelte 5", "Argon2id"],
    image: pactMainAdvance,
    imageAlt: "Pact manager with folders, list and detail.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/Pact",
    slides: [
      {
        title: "Quick access",
        desc: "Active session, search and cards with brand icons: any account in two clicks, with its TOTP code in view.",
        image: pactMainSimple,
        imageAlt: "Pact quick access view.",
        imagePosition: "object-top",
        tags: ["Svelte 5", "TOTP"],
      },
      {
        title: "Full manager",
        desc: "Folders with encrypted names, favorites and trash; each account keeps its username, password and locally generated TOTP seed.",
        image: pactDetails,
        imageAlt: "Pact account list with folders and favorites.",
        imagePosition: "object-top",
        tags: ["Tauri v2", "Argon2id"],
      },
      {
        title: "Local or remote vault",
        desc: "The vault lives in a local .pact file or in MariaDB; either way the server only stores encrypted blobs it cannot read.",
        image: pactSettings,
        imageAlt: "Pact vault settings: local or remote.",
        imagePosition: "object-top",
        tags: ["SQLite", "MariaDB"],
      },
    ],
  },
];

export const projects = {
  es: projectsEs,
  en: projectsEn,
};

/**
 * Proyectos secundarios: sin caso de estudio, se muestran en un grid compacto
 * bajo los destacados. Aquí van los que aportan pero no necesitan una lámina
 * completa, en el orden en que aparecen.
 *
 * Capturas: todas son pantallas reales del propio proyecto
 * (verificadas en `src/assets/`).
 */
export interface OtherProject {
  title: string;
  highlight?: string;
  /** Cola tras el tramo teñido, p. ej. `ound` en `s[G]ound`. */
  suffix?: string;
  type: string;
  desc: string;
  stack: string[];
  image: ImageMetadata | string;
  imageAlt?: string;
  imagePosition?: string;
  /** Encuadre de la lámina; por defecto `object-cover`. */
  imageFit?: string;
  github?: string;
  demo?: string;
}

const otherEs: OtherProject[] = [
  {
    title: "go",
    highlight: "rrson",
    type: "05 / Motor RSS",
    desc: "Motor RSS en Go con API Fever real, base de datos aislada por usuario y protección SSRF en el proxy de imágenes.",
    stack: ["Go", "SQLite FTS5", "Docker"],
    image: gorrsonMain,
    imageAlt: "Bandeja de entrada de gorrson con artículos.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/gorrson",
  },
  {
    title: "plan",
    highlight: "ns",
    type: "06 / Geometría",
    desc: "Diseñador de planos de vivienda con geometría computacional real, cálculo de superficies y presupuesto según normativa.",
    stack: ["Go", "Svelte", "Three.js"],
    image: plannsHero,
    imageAlt: "Plano de vivienda en planns con cálculo de superficies y presupuesto.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/planns",
  },
  {
    title: "s",
    highlight: "G",
    suffix: "ound",
    type: "07 / Música",
    desc: "Servidor de música con subset OpenSubsonic (21 vistas) y transcodificación al vuelo, con escritura física de etiquetas en Go puro.",
    stack: ["Go", "Svelte", "SQLite", "OpenSubsonic"],
    image: sgoundImageMain,
    imageAlt: "Biblioteca de sGound con panel, descubrimiento y reproductor.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/sGound",
  },
  {
    title: "g",
    highlight: "git",
    type: "08 / Forja Git",
    desc: "Servidor de forja Git autoalojado: Gin y GORM en el backend, SvelteKit en el frontend y migraciones de base de datos versionadas.",
    stack: ["Go", "Gin", "GORM", "SvelteKit"],
    image: ggitMain,
    imageAlt: "Panel principal de ggit.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/ggit",
  },
  {
    title: "Recipe",
    highlight: "Node",
    type: "09 / Recetas",
    desc: "Plataforma de recetas que usa el sistema de archivos como base de datos: recetas en Markdown, legibles y editables desde cualquier editor.",
    stack: ["Node.js", "Express", "SQLite", "Socket.io"],
    image: recipeNodeMain,
    imageAlt: "Página principal de RecipeNode.",
    imagePosition: "object-left-top",
    github: "https://github.com/nefDevelop/RecipeNode",
  },
];

const otherEn: OtherProject[] = [
  {
    title: "go",
    highlight: "rrson",
    type: "05 / RSS engine",
    desc: "An RSS engine in Go with a real Fever API, a database isolated per user and SSRF protection in the image proxy.",
    stack: ["Go", "SQLite FTS5", "Docker"],
    image: gorrsonMain,
    imageAlt: "gorrson inbox with articles.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/gorrson",
  },
  {
    title: "plan",
    highlight: "ns",
    type: "06 / Geometry",
    desc: "A floor plan designer with real computational geometry, surface calculation and budgeting against building regulations.",
    stack: ["Go", "Svelte", "Three.js"],
    image: plannsHero,
    imageAlt: "Floor plan in planns with surface calculation and budgeting.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/planns",
  },
  {
    title: "s",
    highlight: "G",
    suffix: "ound",
    type: "07 / Music",
    desc: "A music server with an OpenSubsonic subset (21 views) and on-the-fly transcoding and physical tag writing in pure Go.",
    stack: ["Go", "Svelte", "SQLite", "OpenSubsonic"],
    image: sgoundImageMain,
    imageAlt: "sGound library with dashboard, discovery and player.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/sGound",
  },
  {
    title: "g",
    highlight: "git",
    type: "08 / Git forge",
    desc: "A self-hosted Git forge: Gin and GORM on the backend, SvelteKit on the frontend and versioned database migrations.",
    stack: ["Go", "Gin", "GORM", "SvelteKit"],
    image: ggitMain,
    imageAlt: "ggit main dashboard.",
    imagePosition: "object-top",
    github: "https://github.com/nefDevelop/ggit",
  },
  {
    title: "Recipe",
    highlight: "Node",
    type: "09 / Recipes",
    desc: "A recipe platform that uses the file system as its database: recipes in Markdown, readable and editable from any editor.",
    stack: ["Node.js", "Express", "SQLite", "Socket.io"],
    image: recipeNodeMain,
    imageAlt: "RecipeNode main page.",
    imagePosition: "object-left-top",
    github: "https://github.com/nefDevelop/RecipeNode",
  },
];

export const otherProjects = {
  es: otherEs,
  en: otherEn,
};
