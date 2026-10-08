import type { ImageMetadata } from "astro";

// Destacados.
import regioMain from "../assets/regio-main.png";
import regio2fa from "../assets/regio-2fa.png";
import regioBridges from "../assets/regio-bridges.png";
import regioAdmin1 from "../assets/regio-admin-1.png";
import gaveocApp from "../assets/gaveoc-app.png";
import galoweCover from "../assets/galowe-cover.png";
import gevopLogo from "../assets/gevop-logo.png";

// Rejilla.
import recipeNodeMain from "../assets/recipeNode-main.png";
import pactLoginWide from "../assets/pact-loginWide.png";
import pactWideList from "../assets/pact-widelist.png";
import pactSettings from "../assets/pact-settings.png";
import pactDetails from "../assets/pact-details.png";
import pactDetailsOpen from "../assets/pact-detailsopen.png";
import pactListMOpen from "../assets/pact-listMopen.png";
import gorrsonBanner from "../assets/gorrson-banner.png";
import ricewayFrame from "../assets/riceway-frame.png";
import plannsHero from "../assets/planns-hero.png";
import ggitIcon from "../assets/ggit-icon.png";

// Capturas pendientes de reemplazo: mientras no existan las reales de cada
// proyecto, estas se reutilizan como marcador de posición. Cada uso lleva un
// comentario `TODO(captura)` con el proyecto al que pertenece.
import regioAdmin2 from "../assets/regio-admin-2.png";
import regioAdmin3 from "../assets/regio-admin-3.png";
import regioProfile1 from "../assets/regio-profile-1.png";
import regioProfile2 from "../assets/regio-profile-2.png";
import regioProfile3 from "../assets/regio-profile-3.png";

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
  stack: ["TypeScript", "React", "Node.js", "Go"],
};

export const about = {
  description_1:
    "Técnico Superior en Desarrollo de Aplicaciones Web. Me centro en el lado full stack: interfaces que se sienten bien y servicios que se sostienen.",
  description_2:
    "Trabajo con el principio KISS, con accesibilidad por defecto y sin capas innecesarias. Me interesa especialmente el desarrollo web con Astro y el crecimiento de bases de código que otras personas tienen que mantener.",
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
    items: ["Golang", "Java", "Python", "C#", "JavaScript", "TypeScript"],
  },
  {
    key: "frontend",
    items: ["React", "Astro", "Tailwind CSS"],
  },
  {
    key: "data",
    items: ["SQLite", "PostgreSQL", "MySQL"],
  },
  {
    key: "ops",
    items: ["Docker", "Podman", "Linux (Debian/Fedora)", "Bash", "Git"],
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
export const experience: Entry[] = [
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
];

export const education: Entry[] = [
  {
    title: "Grado Superior en Desarrollo de Aplicaciones Web",
    place: "Ilerna",
    period: "2024 — 2026",
    desc: "Formación técnica en desarrollo web full stack: bases de datos, integración de APIs, despliegue y aplicaciones multiplataforma.",
  },
];

export const certifications: Entry[] = [
  {
    title: "Formación avanzada de Backend: Python, Flask y Django",
    place: "IBM SkillsBuild",
    period: "2025",
    desc: "Arquitectura web, bases de datos, testing automatizado y escalabilidad.",
  },
];

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
    imagePosition: "object-center",
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
    image: gaveocApp,
    imageAlt: "Identidad visual de Gaveoc.",
    imagePosition: "object-center",
    slides: [
      {
        title: "Cuatro superficies",
        desc: "Una sola base de código se entrega como SPA con SvelteKit 5, PWA instalable, app de Android vía Capacitor y extensión de navegador MV3.",
        // TODO(captura): sustituir por una vista real de la SPA de Gaveoc.
        image: regioAdmin2,
        imageAlt: "Captura pendiente de Gaveoc.",
        imagePosition: "object-top",
        tags: ["SvelteKit", "PWA", "Capacitor"],
      },
      {
        title: "Archivado e índice",
        desc: "Obelisk descarga la página con todos sus recursos y Readability extrae el artículo limpio; SQLite con FTS5 resuelve la búsqueda de texto completo.",
        // TODO(captura): sustituir por el detalle de un artículo archivado.
        image: regioAdmin3,
        imageAlt: "Captura pendiente de Gaveoc.",
        imagePosition: "object-top",
        tags: ["SQLite FTS5", "Readability"],
      },
      {
        title: "Procesado asíncrono",
        desc: "OCR con Tesseract y pdftoppm sobre una cola de workers con reintentos, para indexar también documentos escaneados.",
        // TODO(captura): sustituir por la cola de trabajos de Gaveoc.
        image: regioProfile1,
        imageAlt: "Captura pendiente de Gaveoc.",
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
    image: galoweCover,
    imageAlt: "Portada de un libro de la biblioteca de demostración de Galowe.",
    imagePosition: "object-center",
    slides: [
      {
        title: "Conversión propia",
        desc: "Motor de conversión con 14 formatos de entrada y 8 de salida, y un parser de MOBI y PalmDB escrito desde cero, compresor PalmDOC incluido.",
        // TODO(captura): sustituir por la cola de conversión de Galowe.
        image: regioProfile2,
        imageAlt: "Captura pendiente de Galowe.",
        imagePosition: "object-top",
        tags: ["MOBI", "PalmDOC", "EPUB"],
      },
      {
        title: "Sincronización real",
        desc: "Servidor KOSync nativo con el partialMD5 de KOReader reimplementado en Go, para que web y dispositivo compartan la posición exacta de lectura.",
        // TODO(captura): sustituir por el lector web de Galowe.
        image: regioProfile3,
        imageAlt: "Captura pendiente de Galowe.",
        imagePosition: "object-top",
        tags: ["KOSync", "KOReader"],
      },
      {
        title: "Cuatro vías al Kindle",
        desc: "Send-to-Kindle por SMTP, USB/MTP, un portal E-Ink sin JavaScript y KOSync, además de un lector Foliate.js con cinco temas y OpenDyslexic.",
        // TODO(captura): sustituir por el portal E-Ink de Galowe.
        image: pactWideList,
        imageAlt: "Captura pendiente de Galowe.",
        imagePosition: "object-top",
        tags: ["SMTP", "E-Ink", "USB"],
      },
    ],
  },
  {
    slug: "gevop",
    title: "Ge",
    highlight: "vop",
    type: "04 / IDE",
    desc: "IDE escrito en Go con LSP, DAP, Git y terminal PTY reales. El mismo binario arranca como aplicación de escritorio o como servidor web.",
    stack: ["Go", "Wails", "Svelte", "JSON-RPC"],
    image: gevopLogo,
    imageAlt: "Identidad visual de Gevop.",
    imagePosition: "object-center",
    slides: [
      {
        title: "Plugins aislados",
        desc: "Las extensiones viven en procesos independientes que hablan JSON-RPC 2.0 sobre stdin/stdout: un fallo en un plugin no tumba el IDE y puede estar escrito en cualquier lenguaje.",
        // TODO(captura): sustituir por la gestión de plugins de Gevop.
        image: pactSettings,
        imageAlt: "Captura pendiente de Gevop.",
        imagePosition: "object-top",
        tags: ["JSON-RPC", "Plugins"],
      },
      {
        title: "Inteligencia de código",
        desc: "Soporte LSP completo (completado, definición, hover, rename, semantic tokens) sobre un dominio separado de la infraestructura.",
        // TODO(captura): sustituir por el editor con LSP activo.
        image: pactDetails,
        imageAlt: "Captura pendiente de Gevop.",
        imagePosition: "object-top",
        tags: ["LSP", "Clean Architecture"],
      },
      {
        title: "Historial por deltas",
        desc: "Recupera versiones anteriores de cualquier archivo con snapshots por deltas firmados con SHA-256 y una retención de 50 versiones.",
        // TODO(captura): sustituir por el historial de versiones de Gevop.
        image: pactDetailsOpen,
        imageAlt: "Captura pendiente de Gevop.",
        imagePosition: "object-top",
        tags: ["SHA-256", "SQLite"],
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
    imagePosition: "object-center",
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
    image: gaveocApp,
    imageAlt: "Gaveoc visual identity.",
    imagePosition: "object-center",
    slides: [
      {
        title: "Four delivery surfaces",
        desc: "A single codebase ships as a SvelteKit 5 SPA, an installable PWA, an Android app through Capacitor and an MV3 browser extension.",
        // TODO(captura): sustituir por una vista real de la SPA de Gaveoc.
        image: regioAdmin2,
        imageAlt: "Gaveoc screenshot pending.",
        imagePosition: "object-top",
        tags: ["SvelteKit", "PWA", "Capacitor"],
      },
      {
        title: "Archiving and index",
        desc: "Obelisk fetches the page with all its assets and Readability extracts the clean article; SQLite with FTS5 powers full-text search.",
        // TODO(captura): sustituir por el detalle de un artículo archivado.
        image: regioAdmin3,
        imageAlt: "Gaveoc screenshot pending.",
        imagePosition: "object-top",
        tags: ["SQLite FTS5", "Readability"],
      },
      {
        title: "Asynchronous pipeline",
        desc: "OCR through Tesseract and pdftoppm on a worker queue with retries, so scanned documents get indexed too.",
        // TODO(captura): sustituir por la cola de trabajos de Gaveoc.
        image: regioProfile1,
        imageAlt: "Gaveoc screenshot pending.",
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
    image: galoweCover,
    imageAlt: "Book cover from the Galowe demo library.",
    imagePosition: "object-center",
    slides: [
      {
        title: "In-house conversion",
        desc: "A conversion engine with 14 input and 8 output formats, plus a MOBI and PalmDB parser written from scratch, PalmDOC compressor included.",
        // TODO(captura): sustituir por la cola de conversión de Galowe.
        image: regioProfile2,
        imageAlt: "Galowe screenshot pending.",
        imagePosition: "object-top",
        tags: ["MOBI", "PalmDOC", "EPUB"],
      },
      {
        title: "Real synchronisation",
        desc: "A native KOSync server with KOReader's partialMD5 reimplemented in Go, so the web reader and the device share the exact reading position.",
        // TODO(captura): sustituir por el lector web de Galowe.
        image: regioProfile3,
        imageAlt: "Galowe screenshot pending.",
        imagePosition: "object-top",
        tags: ["KOSync", "KOReader"],
      },
      {
        title: "Four ways to the Kindle",
        desc: "Send-to-Kindle over SMTP, USB/MTP, a JavaScript-free E-Ink portal and KOSync, plus a Foliate.js reader with five themes and OpenDyslexic.",
        // TODO(captura): sustituir por el portal E-Ink de Galowe.
        image: pactWideList,
        imageAlt: "Galowe screenshot pending.",
        imagePosition: "object-top",
        tags: ["SMTP", "E-Ink", "USB"],
      },
    ],
  },
  {
    slug: "gevop",
    title: "Ge",
    highlight: "vop",
    type: "04 / IDE",
    desc: "An IDE written in Go with real LSP, DAP, Git and PTY terminal. The same binary starts as a desktop app or as a web server.",
    stack: ["Go", "Wails", "Svelte", "JSON-RPC"],
    image: gevopLogo,
    imageAlt: "Gevop visual identity.",
    imagePosition: "object-center",
    slides: [
      {
        title: "Isolated plugins",
        desc: "Extensions live in separate processes speaking JSON-RPC 2.0 over stdin/stdout: a failing plugin cannot bring the IDE down and can be written in any language.",
        // TODO(captura): sustituir por la gestión de plugins de Gevop.
        image: pactSettings,
        imageAlt: "Gevop screenshot pending.",
        imagePosition: "object-top",
        tags: ["JSON-RPC", "Plugins"],
      },
      {
        title: "Code intelligence",
        desc: "Full LSP support (completion, definition, hover, rename, semantic tokens) over a domain layer kept apart from infrastructure.",
        // TODO(captura): sustituir por el editor con LSP activo.
        image: pactDetails,
        imageAlt: "Gevop screenshot pending.",
        imagePosition: "object-top",
        tags: ["LSP", "Clean Architecture"],
      },
      {
        title: "Delta history",
        desc: "Recover earlier versions of any file through delta snapshots signed with SHA-256 and a retention of 50 versions.",
        // TODO(captura): sustituir por el historial de versiones de Gevop.
        image: pactDetailsOpen,
        imageAlt: "Gevop screenshot pending.",
        imagePosition: "object-top",
        tags: ["SHA-256", "SQLite"],
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
 * Capturas: las de PactRust, gorrson y RecipeNode son reales; el resto usa
 * material del propio proyecto o un marcador `TODO(captura)` hasta que existan
 * las pantallas definitivas.
 */
export interface OtherProject {
  title: string;
  highlight?: string;
  type: string;
  desc: string;
  stack: string[];
  image: ImageMetadata | string;
  imageAlt?: string;
  imagePosition?: string;
  github?: string;
  demo?: string;
}

const otherEs: OtherProject[] = [
  {
    title: "Pact",
    highlight: "Rust",
    type: "05 / Gestor de contraseñas",
    desc: "Gestor de contraseñas de escritorio con cifrado de extremo a extremo en el cliente: el servidor nunca llega a ver la clave maestra.",
    stack: ["Tauri v2", "Rust", "Svelte 5", "Argon2id"],
    image: pactLoginWide,
    imageAlt: "Pantalla de inicio de sesión de PactRust.",
    imagePosition: "object-center",
  },
  {
    title: "gorrson",
    type: "06 / Motor RSS",
    desc: "Motor RSS en Go con API Fever real, base de datos aislada por usuario y protección SSRF en el proxy de imágenes.",
    stack: ["Go", "SQLite FTS5", "Docker"],
    image: gorrsonBanner,
    imageAlt: "Identidad visual de gorrson.",
    imagePosition: "object-center",
  },
  {
    title: "riceway",
    type: "07 / Barra Wayland",
    desc: "Barra de estado y sistema de widgets para Wayland sobre wgpu, sin GTK ni Qt, con la lógica de la interfaz escrita en Rhai y recarga en caliente.",
    stack: ["Rust", "wgpu", "Rhai"],
    // TODO(captura): sustituir por una captura limpia de la barra sin escritorio.
    image: ricewayFrame,
    imageAlt: "Barra de estado de riceway sobre un escritorio.",
    imagePosition: "object-top",
  },
  {
    title: "planns",
    type: "08 / Geometría",
    desc: "Diseñador de planos de vivienda con geometría computacional real, cálculo de superficies y presupuesto según normativa.",
    stack: ["Go", "Svelte", "Three.js"],
    // TODO(captura): sustituir por un plano real con la vista 3D.
    image: plannsHero,
    imageAlt: "Ilustración de planns.",
    imagePosition: "object-center",
  },
  {
    title: "sGound",
    type: "09 / Música",
    desc: "Servidor de música compatible con OpenSubsonic y transcodificación al vuelo, con escritura física de etiquetas en Go puro.",
    stack: ["Go", "Svelte", "SQLite", "OpenSubsonic"],
    // TODO(captura): sustituir por la biblioteca de sGound.
    image: pactListMOpen,
    imageAlt: "Captura pendiente de sGound.",
    imagePosition: "object-center",
  },
  {
    title: "ggit",
    type: "10 / Forja Git",
    desc: "Servidor de forja Git autoalojado: Gin y GORM en el backend, SvelteKit en el frontend y migraciones de base de datos versionadas.",
    stack: ["Go", "Gin", "GORM", "SvelteKit"],
    // TODO(captura): sustituir por la vista de repositorio de ggit.
    image: ggitIcon,
    imageAlt: "Identidad visual de ggit.",
    imagePosition: "object-center",
  },
  {
    title: "Recipe",
    highlight: "Node",
    type: "11 / Recetas",
    desc: "Plataforma de recetas que usa el sistema de archivos como base de datos: recetas en Markdown, legibles y editables desde cualquier editor.",
    stack: ["Node.js", "Express", "SQLite", "Socket.io"],
    image: recipeNodeMain,
    imageAlt: "Página principal de RecipeNode.",
    imagePosition: "object-left",
    github: "https://github.com/nefDevelop/RecipeNode",
  },
];

const otherEn: OtherProject[] = [
  {
    title: "Pact",
    highlight: "Rust",
    type: "05 / Password manager",
    desc: "A desktop password manager with end-to-end encryption on the client: the server never gets to see the master key.",
    stack: ["Tauri v2", "Rust", "Svelte 5", "Argon2id"],
    image: pactLoginWide,
    imageAlt: "PactRust login screen.",
    imagePosition: "object-center",
  },
  {
    title: "gorrson",
    type: "06 / RSS engine",
    desc: "An RSS engine in Go with a real Fever API, a database isolated per user and SSRF protection in the image proxy.",
    stack: ["Go", "SQLite FTS5", "Docker"],
    image: gorrsonBanner,
    imageAlt: "gorrson visual identity.",
    imagePosition: "object-center",
  },
  {
    title: "riceway",
    type: "07 / Wayland bar",
    desc: "A status bar and widget system for Wayland on top of wgpu, with no GTK or Qt, whose UI logic is written in Rhai with hot reload.",
    stack: ["Rust", "wgpu", "Rhai"],
    // TODO(captura): sustituir por una captura limpia de la barra sin escritorio.
    image: ricewayFrame,
    imageAlt: "riceway status bar over a desktop.",
    imagePosition: "object-top",
  },
  {
    title: "planns",
    type: "08 / Geometry",
    desc: "A floor plan designer with real computational geometry, surface calculation and budgeting against building regulations.",
    stack: ["Go", "Svelte", "Three.js"],
    // TODO(captura): sustituir por un plano real con la vista 3D.
    image: plannsHero,
    imageAlt: "planns illustration.",
    imagePosition: "object-center",
  },
  {
    title: "sGound",
    type: "09 / Music",
    desc: "An OpenSubsonic-compatible music server with on-the-fly transcoding and physical tag writing in pure Go.",
    stack: ["Go", "Svelte", "SQLite", "OpenSubsonic"],
    // TODO(captura): sustituir por la biblioteca de sGound.
    image: pactListMOpen,
    imageAlt: "sGound screenshot pending.",
    imagePosition: "object-center",
  },
  {
    title: "ggit",
    type: "10 / Git forge",
    desc: "A self-hosted Git forge: Gin and GORM on the backend, SvelteKit on the frontend and versioned database migrations.",
    stack: ["Go", "Gin", "GORM", "SvelteKit"],
    // TODO(captura): sustituir por la vista de repositorio de ggit.
    image: ggitIcon,
    imageAlt: "ggit visual identity.",
    imagePosition: "object-center",
  },
  {
    title: "Recipe",
    highlight: "Node",
    type: "11 / Recipes",
    desc: "A recipe platform that uses the file system as its database: recipes in Markdown, readable and editable from any editor.",
    stack: ["Node.js", "Express", "SQLite", "Socket.io"],
    image: recipeNodeMain,
    imageAlt: "RecipeNode main page.",
    imagePosition: "object-left",
    github: "https://github.com/nefDevelop/RecipeNode",
  },
];

export const otherProjects = {
  es: otherEs,
  en: otherEn,
};
