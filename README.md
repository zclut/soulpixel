# 👾 SoulPixel – Pizarra Colaborativa en Tiempo Real

Un experimento visual donde múltiples usuarios interactúan en una cuadrícula digital de 64x64, pintando celdas en tiempo real. Cada acción se transmite instantáneamente a todos los participantes, creando una experiencia colectiva y creativa, al estilo de [r/place](https://en.wikipedia.org/wiki/Reddit_Place).

> Proyecto desarrollado para [Hackathon 2025 Clerk de midudev](https://github.com/midudev/hackaton-clerk-2025) 🧠⚡

---

## 🚀 Demo

👉 [Link en vivo (si está desplegado)](https://klasinky.soulpixel.com)
📷 Captura de pantalla:

![demo](./screenshot.png)

---

## 💠 Tecnologías utilizadas

* **Frontend**: [Astro](https://astro.build/) + React + TailwindCSS
* **Backend / API**: Endpoints creados directamente en Astro
* **Base de datos**: Supabase (PostgreSQL + Realtime)
* **Gestión de usuarios**: Clerk
* **Realtime**: Supabase Channels (WebSocket)
* **Infraestructura**: Docker, Docker Compose, Nginx

---

## 🎯 ¿Qué hace esta app?

* Cada usuario puede pintar una celda en una cuadrícula
* Los cambios se transmiten a todos los usuarios conectados en tiempo real
* Cada celda guarda: `posición (x, y)`, `color`, `usuario`, `fecha`
* Las actualizaciones se almacenan en Supabase y se reflejan automáticamente en el cliente
* Tiene soporte para modo pantalla completa y visualización en vivo

---

## 📦 Instalación local

```bash
git clone https://github.com/zclut/pixel
cd pixel-grid-realtime

# Configura variables de entorno para Supabase
cp .env.example .env

# Inicia en modo desarrollo
npm install
npm run dev
```

---

## 🚢 Despliegue en VPS con Docker

```bash
docker-compose up --build -d
```
## 🤝 Equipo

* **zClut** – [@zclut](https://github.com/zclut)
* **Klasinky** – [@klasinky](https://github.com/klasinky)

---

## 🧠 Inspiración

Inspirado en proyectos colaborativos como:

* [Reddit Place](https://www.reddit.com/r/place/)

---

## 📜 Licencia

MIT © 2025
