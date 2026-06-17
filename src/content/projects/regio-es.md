---
title: "re"
highlight: "GIO"
type: "02 / Reverse Proxy"
desc: "Reverse Proxy ligero en Go diseñado para proteger servicios internos con autenticación centralizada y seguridad avanzada."
image: "https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?q=80&w=1200&auto=format&fit=crop"
imageAlt: "Representación de servidores y redes de alta seguridad"
imagePosition: "object-center"
color: "text-blue-500"
lang: "es"
order: 2
github: "https://github.com/nefDevelop/regio"
---

## El Desafío
Proteger servicios internos en redes privadas suele requerir configuraciones complejas o herramientas pesadas. El objetivo de **reGIO** fue crear una solución "zero-trust" extremadamente ligera, escrita en **Go**, que fuera fácil de desplegar pero inflexible ante ataques comunes.

## Solución Técnica
Implementé un sistema de autenticación centralizada que actúa como una aduana digital antes de que cualquier petición llegue al servicio final.

### Arquitectura y Seguridad:
- **Criptografía Avanzada (Argon2id & AES-256-GCM):** Las contraseñas se protegen con hashes Argon2id, mientras que los secretos 2FA (TOTP) se almacenan cifrados en reposo con AES-256-GCM, garantizando máxima seguridad en caso de exposición de la base de datos.
- **Protección contra DNS Rebinding:** El proxy resuelve los dominios internamente antes de conectar, evitando que un atacante engañe al sistema para acceder a IPs privadas restringidas.
- **Validación SSRF:** Mediante un `SafeDialContext` personalizado, se bloquea el acceso a rangos de red locales o sensibles no autorizados.
- **WAF y Anti-Botnet Integrados:** Inspección de tráfico en tiempo real para bloquear SQLi, XSS, path traversal y ataques de fuerza bruta distribuidos.
- **Fail2Ban de Red:** Sistema de bloqueo automático por IP y subred (/24 o /64) con persistencia en SQLite, mitigando ataques coordinados.
- **Compatibilidad con Cloudflare Tunnels:** Diseñado para integrarse perfectamente detrás de redes de Cloudflare Tunnels, añadiendo una capa de autorización "zero-trust" sin generar conflictos de enrutamiento.

### Gestión y Funcionalidades Clave:
- **Administración por CLI:** La configuración reside en SQLite y se puede gestionar ágilmente desde la terminal mediante comandos nativos.
- **Políticas CSP Dinámicas:** Sistema de Content Security Policy con un flujo "Discover & Allow", mostrando los reportes de recursos bloqueados en tiempo real.
- **Automatización Segura:** Integración nativa con Git, APIs y Webhooks mediante múltiples formatos de *App Tokens* y *Bypass Tokens* dedicados.
- **Conectividad Universal:** Soporte nativo para WebSockets y capacidad Single Sign-On (SSO) inyectando la cabecera `X-Forwarded-User` hacia el backend.
- **Onboarding sin Contraseñas:** Sistema de invitaciones mediante tokens de un solo uso, eliminando por completo el riesgo de credenciales por defecto.

## Resultados
reGIO expone servicios de forma segura con un binario de menos de 15MB y un consumo que rara vez supera los **20MB de RAM**. Es la solución ideal para entornos auto-alojados (Self-Hosted) que priorizan la seguridad sin sacrificar el rendimiento.
