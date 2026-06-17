import type { ImageMetadata } from "astro";
import recipeNodeMain from "../assets/recipeNode-main.png";
import recipeNodeMobile from "../assets/recipeNode-mobile.png";
import recipeNodePlaning from "../assets/recipeNode-planning.png";
import recipeNodeArch from "../assets/recipeNode-arch.png";

export const personalInfo = {
  name: "Neftalí",
  role: "Desarrollador Web",
  description: "Creo soluciones digitales minimalistas, funcionales y memorables.",
  social: {
    github: "https://github.com/nefDevelop",
    linkedin: "https://www.linkedin.com/in/neftal%C3%AD-dom%C3%ADnguez-urda/",
    email: "mailto:nefdevelop@gmail.com",
  },
};

export const about = {
  description_1:
    "Técnico Superior DAW especializado en arquitecturas pragmáticas. Aplico el principio KISS para transformar problemas complejos en sistemas modulares y eficientes.",
  description_2:
    "Me dedico a transformar requerimientos de negocio en experiencias de usuario fluidas, priorizando siempre la optimización del rendimiento y la accesibilidad.",
};

export const skills = ["JavaScript", "TypeScript", "React", "Astro", "Node.js", "Tailwind CSS", "Git"];

export interface Job {
  title: string;
  company: string;
  period: string;
  desc: string;
}

export const experience: Job[] = [
  {
    title: "GS Desarrollo de Aplicaciones Web",
    company: "Ilerna",
    period: "2024 - 2026",
    desc: "Técnico Superior DAW | Full-Stack Developer Desarrollo de soluciones web escalables, integración de APIs, gestión de bases de datos y despliegue de aplicaciones multiplataforma.",
  },
  {
    title: "Certificado de Formación avanzada Backend: Python, Flask, Django ",
    company: "Bejob colaboracion con IBM Skillsbuild",
    period: "Marzo - Mayo 2025",
    desc: "Python Backend: Flask, Django & Optimización Dominio de arquitectura web, bases de datos, testing automatizado y escalabilidad para aplicaciones de alto rendimiento.",
  },
];

export interface Slide {
  title: string;
  desc: string;
  image: string | ImageMetadata;
  imageAlt?: string;
  imagePosition?: string;
  tags?: string[];
  link?: string;
}

export interface Project {
  title: string;
  highlight: string;
  type: string;
  desc: string;
  image: string | ImageMetadata;
  imageAlt?: string;
  imagePosition?: string;
  color: string;
  slides: Slide[];
}

const projectsEs: Project[] = [
  {
    title: "Recipe",
    highlight: "Node",
    type: "01 / Recetas MD",
    desc: "Plataforma de recetas basadas en archivos markdown.",
    image: recipeNodeMain,
    imageAlt: "Interfaz de la pagina princiapl de RecipeNode, mostrando las recetas.",
    imagePosition: "object-center md:object-left",
    color: "text-green-600",
    slides: [
      {
        title: "Planning",
        desc: "Planifica tu mes/semana y prepara la lista de la compra acorde a los ingredientes.",
        image: recipeNodePlaning,
        imageAlt: "Vista mensual de la planificacion de comidas.",
        imagePosition: "object-center md:object-left",
      },
      {
        title: "Arquitectura",
        desc: "Las recetas se almacenan en formato Markdown, se analizan con front-matter y marked, y se actualizan en tiempo real. El sistema aprovecha el poder de Markdown para una gestión de contenido flexible y legible.",
        image: recipeNodeArch,
        imageAlt: "Diagrama de arquitectura de RecipeNode mostrando el flujo de datos desde archivos Markdown hasta el cliente.",
        imagePosition: "object-center md:object-left",
        tags: ["Node.js", "SQLite", "Socket.io"],
      },
      {
        title: "Experiencia Móvil",
        desc: 'La aplicación está diseñada con un enfoque "mobile-first". La interfaz es completamente responsive, adaptándose a cualquier tamaño de pantalla.',
        image: recipeNodeMobile,
        imageAlt: "Vista de la web en movil",
        imagePosition: "object-top",
      },
    ],
  },
  {
    title: "re",
    highlight: "GIO",
    type: "02 / Reverse Proxy",
    desc: "Reverse Proxy ligero en Go diseñado para proteger servicios internos con autenticación centralizada y seguridad avanzada.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Representación de servidores y redes de alta seguridad",
    imagePosition: "object-center",
    color: "text-blue-500",
    slides: [
      {
        title: "Seguridad 2FA",
        desc: "Protección total con autenticación en dos pasos (TOTP) y secretos cifrados en reposo mediante AES-256-GCM.",
        image: "https://images.unsplash.com/photo-1633265485768-3069c9b05862?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Seguridad digital y cifrado",
        tags: ["Go", "AES-256", "TOTP"],
      },
      {
        title: "Mitigación Activa",
        desc: "Sistema Fail2Ban de red integrado y protección contra ataques de DNS Rebinding y SSRF para servicios críticos.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Escudo de seguridad y código fuente",
        tags: ["Security", "Network", "Fail2Ban"],
      },
      {
        title: "Panel de Control",
        desc: "Administración centralizada de servicios, políticas CSP dinámicas y auditoría inalterable de eventos en tiempo real.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Panel de control y analíticas",
        link: "https://github.com/nef734/regio",
      },
    ],
  },
];

const projectsEn: Project[] = [
  {
    title: "Recipe",
    highlight: "Node",
    type: "01 / MD Recipes",
    desc: "A recipe platform based on Markdown files.",
    image: recipeNodeMain,
    imageAlt: "Interface of the RecipeNode main page, displaying recipes.",
    imagePosition: "object-center md:object-left",
    color: "text-green-600",
    slides: [
      {
        title: "Planning",
        desc: "Plan your month/week and create a shopping list based on ingredients.",
        image: recipeNodePlaning,
        imageAlt: "Monthly view of meal planning.",
        imagePosition: "object-center md:object-left",
      },
      {
        title: "Architecture",
        desc: "Recipes are stored in Markdown format, parsed using front-matter and marked, and updated in real time. The system leverages the power of Markdown for flexible and readable content management.",
        image: recipeNodeArch,
        imageAlt: "Architecture diagram of RecipeNode showing the data flow from Markdown files to the client.",
        imagePosition: "object-center md:object-left",
        tags: ["Node.js", "SQLite", "Socket.io"],
      },
      {
        title: "Mobile Experience",
        desc: "The app is designed with a 'mobile-first' approach. The interface is fully responsive and adapts to any screen size.",
        image: recipeNodeMobile,
        imageAlt: "RecipeNode view on a mobile phone.",
        imagePosition: "object-top",
      },
    ],
  },
  {
    title: "re",
    highlight: "GIO",
    type: "02 / Reverse Proxy",
    desc: "Lightweight Reverse Proxy in Go designed to protect internal services with centralized authentication and advanced security.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Representation of high-security servers and networks",
    imagePosition: "object-center",
    color: "text-blue-500",
    slides: [
      {
        title: "2FA Security",
        desc: "Complete protection with two-factor authentication (TOTP) and secrets encrypted at rest using AES-256-GCM.",
        image: "https://images.unsplash.com/photo-1633265485768-3069c9b05862?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Digital security and encryption",
        tags: ["Go", "AES-256", "TOTP"],
      },
      {
        title: "Active Mitigation",
        desc: "Integrated network Fail2Ban system and protection against DNS Rebinding and SSRF attacks for critical services.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Security shield and source code",
        tags: ["Security", "Network", "Fail2Ban"],
      },
      {
        title: "Control Panel",
        desc: "Centralized service management, dynamic CSP policies, and unalterable real-time event auditing.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Control panel and analytics",
        link: "https://github.com/nef734/regio",
      },
    ],
  },
];

export const projects = {
  es: projectsEs,
  en: projectsEn,
};
