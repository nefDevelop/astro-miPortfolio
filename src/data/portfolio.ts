export const personalInfo = {
  name: "Neftalí",
  role: "Desarrollador Full Stack",
  description: "Creo soluciones digitales minimalistas, funcionales y memorables.",
  social: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    email: "mailto:contacto@ejemplo.com",
  },
};

export const about = {
  description_1:
    "Soy un desarrollador apasionado por la tecnología y el diseño limpio. Me encanta transformar ideas complejas en interfaces de usuario intuitivas y eficientes.",
  description_2:
    "Cuando no estoy programando, me encontrarás explorando nuevas tecnologías, contribuyendo al código abierto o buscando la taza de café perfecta.",
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
    title: "Senior Frontend Dev",
    company: "Tech Solutions Inc.",
    period: "2021 - Presente",
    desc: "Liderando el desarrollo de la nueva plataforma SaaS utilizando React y Next.js.",
  },
  {
    title: "Full Stack Developer",
    company: "Creative Agency",
    period: "2019 - 2021",
    desc: "Desarrollo de sitios web corporativos y e-commerce con alto tráfico.",
  },
  {
    title: "Junior Developer",
    company: "StartUp Local",
    period: "2018 - 2019",
    desc: "Mantenimiento de código legacy e implementación de nuevas features.",
  },
];

export interface Slide {
  title: string;
  desc: string;
  image: string;
  imageAlt?: string;
  tags?: string[];
  link?: string;
}

export interface Project {
  title: string;
  highlight: string;
  type: string;
  desc: string;
  image: string;
  imageAlt?: string;
  color: string;
  slides: Slide[];
}

export const projects: Project[] = [
  {
    title: "Neon",
    highlight: "Market",
    type: "01 / E-COMMERCE",
    desc: "Plataforma de comercio inmersivo. La primera pantalla muestra el dashboard principal con métricas en tiempo real.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Interfaz del dashboard de Neon mostrando gráficos de ventas y actividad de usuarios en tonos neón",
    color: "text-cyan-400",
    slides: [
      {
        title: "Arquitectura",
        desc: "Construido sobre una arquitectura de microservicios para escalar horizontalmente durante eventos de alto tráfico.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Diagrama abstracto de bloques brillantes representando la estructura de microservicios",
        tags: ["React", "Node.js"],
      },
      {
        title: "Experiencia Móvil",
        desc: "Optimización completa para dispositivos móviles, logrando un aumento del 145% en conversiones.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Vista de la aplicación Neon en un teléfono móvil mostrando el catálogo de productos",
      },
    ],
  },
  {
    title: "Nova",
    highlight: "Bank",
    type: "02 / FINTECH",
    desc: "Banca digital redefinida. Visualización clara de activos y movimientos en tiempo real.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Pantalla principal de la app Nova mostrando el saldo total y gráfico de gastos mensuales",
    color: "text-emerald-400",
    slides: [
      {
        title: "Pagos Instantáneos",
        desc: "Sistema de pagos P2P con confirmación biométrica y cero latencia.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Usuario realizando un pago sin contacto con tarjeta de crédito a través de terminal móvil",
      },
      {
        title: "Seguridad Total",
        desc: "Encriptación de extremo a extremo y detección de fraude mediante IA.",
        image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1000&auto=format&fit=crop",
        imageAlt: "Ilustración conceptual de un candado digital brillante sobre fondo oscuro representando ciberseguridad",
        link: "#",
      },
    ],
  },
];
