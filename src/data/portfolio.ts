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
    linkedin: "https://linkedin.com/in/neftali-dominguez-urda",
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
  // {
  //   title: "Nova",
  //   highlight: "Bank",
  //   type: "02 / FINTECH",
  //   desc: "Banca digital redefinida. Visualización clara de activos y movimientos en tiempo real.",
  //   image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  //   imageAlt: "Pantalla principal de la app Nova mostrando el saldo total y gráfico de gastos mensuales",
  //   imagePosition: "object-center md:object-left",
  //   color: "text-emerald-200",
  //   slides: [
  //     {
  //       title: "Pagos Instantáneos",
  //       desc: "Sistema de pagos P2P con confirmación biométrica y cero latencia.",
  //       image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop",
  //       imageAlt: "Usuario realizando un pago sin contacto con tarjeta de crédito a través de terminal móvil",
  //       imagePosition: "object-center md:object-left",
  //     },
  //     {
  //       title: "Seguridad Total",
  //       desc: "Encriptación de extremo a extremo y detección de fraude mediante IA.",
  //       image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1000&auto=format&fit=crop",
  //       imageAlt: "Ilustración conceptual de un candado digital brillante sobre fondo oscuro representando ciberseguridad",
  //       imagePosition: "object-center md:object-left",
  //       link: "#",
  //     },
  //   ],
  // },
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
  // {
  //   title: "Nova",
  //   highlight: "Bank",
  //   type: "02 / FINTECH",
  //   desc: "Digital banking redefined. Clear visualization of assets and real-time movements.",
  //   image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  //   imageAlt: "Nova app main screen showing total balance and monthly expense graph",
  //   imagePosition: "object-center md:object-left",
  //   color: "text-emerald-200",
  //   slides: [
  //     {
  //       title: "Instant Payments",
  //       desc: "P2P payment system with biometric confirmation and zero latency.",
  //       image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop",
  //       imageAlt: "User making a contactless credit card payment via mobile terminal",
  //       imagePosition: "object-center md:object-left",
  //     },
  //     {
  //       title: "Total Security",
  //       desc: "End-to-end encryption and AI fraud detection.",
  //       image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1000&auto=format&fit=crop",
  //       imageAlt: "Conceptual illustration of a glowing digital padlock on dark background representing cybersecurity",
  //       imagePosition: "object-center md:object-left",
  //       link: "#",
  //     },
  //   ],
  // },
];

export const projects = {
  es: projectsEs,
  en: projectsEn,
};
