---
title: "re"
highlight: "GIO"
type: "02 / Reverse Proxy"
desc: "Lightweight Reverse Proxy in Go designed to protect internal services with centralized authentication and advanced security."
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop"
imageAlt: "Representation of high-security servers and networks"
imagePosition: "object-center"
color: "text-blue-500"
lang: "en"
order: 2
github: "https://github.com/nef734/regio"
---

## The Challenge
Protecting internal services within private networks often requires complex setups or resource-heavy tools. The goal of **reGIO** was to build an extremely lightweight "zero-trust" solution, written in **Go**, that is easy to deploy while remaining unyielding against common network attacks.

## Technical Solution
I implemented a centralized authentication system that acts as a digital checkpoint, validating every request before it ever reaches the backend service.

### Architecture & Security:
- **Advanced Cryptography (Argon2id & AES-256-GCM):** Passwords are cryptographically hashed using Argon2id, and 2FA (TOTP) secrets are stored encrypted at rest via AES-256-GCM, ensuring maximum security against database breaches.
- **DNS Rebinding Protection:** The proxy performs real-time DNS resolution before connecting, preventing attackers from tricking the system into accessing restricted private IPs.
- **SSRF Mitigation:** Utilizing a custom `SafeDialContext`, the gateway blocks unauthorized access to local or sensitive network ranges.
- **Integrated WAF & Anti-Botnet:** Real-time traffic inspection to block SQLi, XSS, path traversal, and distributed brute-force attacks.
- **Network Fail2Ban:** Automatic IP and subnet-level (/24 or /64) blocking with SQLite persistence to mitigate coordinated attacks.
- **Cloudflare Tunnels Compatibility:** Designed to integrate seamlessly behind Cloudflare Tunnels networks, adding a "zero-trust" authorization layer without causing routing conflicts.

### Management & Core Features:
- **CLI Administration:** Configuration is stored in SQLite and can be agilely managed directly from the terminal using native commands.
- **Dynamic CSP Policies:** Content Security Policy system featuring a "Discover & Allow" flow with real-time reporting of blocked resources.
- **Secure Automation:** Native integration for Git, APIs, and Webhooks using multiple *App Token* formats and dedicated *Bypass Tokens*.
- **Universal Connectivity:** Native support for WebSockets and Single Sign-On (SSO) capabilities by injecting the `X-Forwarded-User` header to the backend.
- **Zero-Default Onboarding:** Secure user management utilizing single-use invitation tokens, completely eliminating the risk of default credentials.

## Impact
reGIO enables secure service exposure via a binary under 15MB, typically consuming less than **20MB of RAM**. It is the ideal solution for self-hosted environments that prioritize security without sacrificing performance.
