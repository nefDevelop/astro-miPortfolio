import type { ImageMetadata } from "astro";
import recipeNodeMain from "../assets/recipeNode-main.png";
import recipeNodeMobile from "../assets/recipeNode-mobile.png";
import recipeNodePlaning from "../assets/recipeNode-planning.png";
import recipeNodeArch from "../assets/recipeNode-arch.png";
import regioMain from "../assets/regio-main.png";
import regio2fa from "../assets/regio-2fa.png";
import regioBridges from "../assets/regio-bridges.png";
import regioAdmin1 from "../assets/regio-admin-1.png";
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
    slug: "recipenode",
    title: "Recipe",
    highlight: "Node",
    type: "01 / Recetas Markdown",
    desc: "Plataforma de recetas que usa el sistema de archivos como base de datos: las recetas son archivos Markdown legibles y editables desde cualquier editor.",
    stack: ["Node.js", "Express", "SQLite", "Socket.io", "Markdown"],
    image: recipeNodeMain,
    imageAlt: "Interfaz de la página principal de RecipeNode, mostrando las recetas.",
    imagePosition: "object-left",
    github: "https://github.com/nefDevelop/RecipeNode",
    slides: [
      {
        title: "Planificación",
        desc: "Planifica el mes y la semana, y genera automáticamente la lista de la compra a partir de los ingredientes.",
        image: recipeNodePlaning,
        imageAlt: "Vista mensual de la planificación de comidas.",
        imagePosition: "object-left",
      },
      {
        title: "Arquitectura",
        desc: "Las recetas se almacenan en Markdown, se analizan con front-matter y marked, y se actualizan en tiempo real mediante un vigilant con chokidar.",
        image: recipeNodeArch,
        imageAlt: "Diagrama de arquitectura de RecipeNode mostrando el flujo de datos desde los archivos Markdown hasta el cliente.",
        imagePosition: "object-left",
        tags: ["Node.js", "SQLite", "Socket.io"],
      },
      {
        title: "Experiencia móvil",
        desc: "Enfoque mobile-first: la interfaz se adapta a cualquier tamaño de pantalla sin romper el flujo de trabajo.",
        image: recipeNodeMobile,
        imageAlt: "Vista de RecipeNode en un móvil.",
        imagePosition: "object-top",
      },
    ],
  },
  {
    slug: "regio",
    title: "re",
    highlight: "GIO",
    type: "02 / Reverse Proxy",
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
];

const projectsEn: Project[] = [
  {
    slug: "recipenode",
    title: "Recipe",
    highlight: "Node",
    type: "01 / Markdown recipes",
    desc: "A recipe platform that uses the file system as its database: recipes are Markdown files you can read and edit from any editor.",
    stack: ["Node.js", "Express", "SQLite", "Socket.io", "Markdown"],
    image: recipeNodeMain,
    imageAlt: "Main page of RecipeNode, showing the recipes.",
    imagePosition: "object-left",
    github: "https://github.com/nefDevelop/RecipeNode",
    slides: [
      {
        title: "Planning",
        desc: "Plan your month and your week, and generate the shopping list automatically from the ingredients.",
        image: recipeNodePlaning,
        imageAlt: "Monthly view of the meal planner.",
        imagePosition: "object-left",
      },
      {
        title: "Architecture",
        desc: "Recipes are stored as Markdown, parsed with front-matter and marked, and updated in real time through a chokidar watcher.",
        image: recipeNodeArch,
        imageAlt: "RecipeNode architecture diagram showing the data flow from the Markdown files to the client.",
        imagePosition: "object-left",
        tags: ["Node.js", "SQLite", "Socket.io"],
      },
      {
        title: "Mobile experience",
        desc: "A mobile-first approach: the interface adapts to any screen size without breaking the workflow.",
        image: recipeNodeMobile,
        imageAlt: "RecipeNode on a phone.",
        imagePosition: "object-top",
      },
    ],
  },
  {
    slug: "regio",
    title: "re",
    highlight: "GIO",
    type: "02 / Reverse proxy",
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
];

export const projects = {
  es: projectsEs,
  en: projectsEn,
};

/**
 * Proyectos secundarios: sin caso de estudio, se muestran en un grid compacto
 * bajo los destacados. Aquí van los que no merecen una lámina completa.
 *
 * STUBS: son de relleno para ver la estructura con 7 proyectos. Sustituye
 * título, tipo, descripción, stack y captura por los reales. Las imágenes
 * reutilizan capturas de reGIO que no se estaban usando como marcador de
 * posición.
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
    title: "Proyecto",
    highlight: " 03",
    type: "03 / Herramienta",
    desc: "Descripción pendiente. Sustituye este texto por el resumen real del proyecto.",
    stack: ["TypeScript", "Node.js"],
    image: regioAdmin2,
    imageAlt: "Captura de ejemplo pendiente de sustituir.",
    imagePosition: "object-top",
  },
  {
    title: "Proyecto",
    highlight: " 04",
    type: "04 / Web",
    desc: "Descripción pendiente. Sustituye este texto por el resumen real del proyecto.",
    stack: ["Go", "PostgreSQL"],
    image: regioAdmin3,
    imageAlt: "Captura de ejemplo pendiente de sustituir.",
    imagePosition: "object-top",
  },
  {
    title: "Proyecto",
    highlight: " 05",
    type: "05 / CLI",
    desc: "Descripción pendiente. Sustituye este texto por el resumen real del proyecto.",
    stack: ["Go", "Bash"],
    image: regioProfile1,
    imageAlt: "Captura de ejemplo pendiente de sustituir.",
    imagePosition: "object-top",
  },
  {
    title: "Proyecto",
    highlight: " 06",
    type: "06 / API",
    desc: "Descripción pendiente. Sustituye este texto por el resumen real del proyecto.",
    stack: ["Python", "SQLite"],
    image: regioProfile2,
    imageAlt: "Captura de ejemplo pendiente de sustituir.",
    imagePosition: "object-top",
  },
  {
    title: "Proyecto",
    highlight: " 07",
    type: "07 / Script",
    desc: "Descripción pendiente. Sustituye este texto por el resumen real del proyecto.",
    stack: ["Node.js", "TypeScript"],
    image: regioProfile3,
    imageAlt: "Captura de ejemplo pendiente de sustituir.",
    imagePosition: "object-top",
  },
];

const otherEn: OtherProject[] = [
  {
    title: "Project",
    highlight: " 03",
    type: "03 / Tooling",
    desc: "Placeholder description. Replace this text with the real project summary.",
    stack: ["TypeScript", "Node.js"],
    image: regioAdmin2,
    imageAlt: "Placeholder screenshot.",
    imagePosition: "object-top",
  },
  {
    title: "Project",
    highlight: " 04",
    type: "04 / Web",
    desc: "Placeholder description. Replace this text with the real project summary.",
    stack: ["Go", "PostgreSQL"],
    image: regioAdmin3,
    imageAlt: "Placeholder screenshot.",
    imagePosition: "object-top",
  },
  {
    title: "Project",
    highlight: " 05",
    type: "05 / CLI",
    desc: "Placeholder description. Replace this text with the real project summary.",
    stack: ["Go", "Bash"],
    image: regioProfile1,
    imageAlt: "Placeholder screenshot.",
    imagePosition: "object-top",
  },
  {
    title: "Project",
    highlight: " 06",
    type: "06 / API",
    desc: "Placeholder description. Replace this text with the real project summary.",
    stack: ["Python", "SQLite"],
    image: regioProfile2,
    imageAlt: "Placeholder screenshot.",
    imagePosition: "object-top",
  },
  {
    title: "Project",
    highlight: " 07",
    type: "07 / Script",
    desc: "Placeholder description. Replace this text with the real project summary.",
    stack: ["Node.js", "TypeScript"],
    image: regioProfile3,
    imageAlt: "Placeholder screenshot.",
    imagePosition: "object-top",
  },
];

export const otherProjects = {
  es: otherEs,
  en: otherEn,
};