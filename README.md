# 🧬 Soul Pixel

**Un lienzo cooperativo donde las almas dejan su huella... una chispa a la vez.**

> Proyecto desarrollado para [Hackathon 2025 Clerk de midudev](https://github.com/midudev/hackaton-clerk-2025) 🧠⚡

---

## 🌐 Demo en vivo

👉 [soulpixel.klasinky.com](https://soulpixel.klasinky.com)

---

## ✨ ¿Qué es Soul Pixel?

**Soul Pixel** es una experiencia interactiva inspirada en el mítico [r/place](https://en.wikipedia.org/wiki/Place_(Reddit)), pero con un enfoque más íntimo, poético y espiritual.

Aquí, cada fragmento que colocas no solo es un color en un lienzo, es el **eco de tu alma**. No pintas, **alimentas** a una criatura digital que está naciendo del caos cooperativo. Cada acción deja una marca que formará parte de un **timelapse**, una película que cada dia (a las 12:00, Horario Canario) se reescribe, **rebobinando tu presencia en el alma**.

---

## 🛠️ Características principales

- 🎨 **Pinta el alma:** Coloca **fragmentos** en una cuadrícula compartida. Cada "fragmento" tiene un cooldown: un tiempo que debes esperar para poder pintar de nuevo.
- 🔄 **Timelapse diario:** Todos los días a las 12:00 (Horario Canario) se genera un nuevo vídeo con el proceso de todo lo que las almas han pintado en las últimas 24 horas.
- 🙌 **Tu reflejo en el feed:** Un feed en tiempo real muestra quién está dejando su marca en el **alma** justo ahora.
- 🧱 **Sistema de rangos:** Gana rangos únicos conforme alimentas tu alma con más píxeles. Desde un simple `ECHO` hasta convertirte en `ETERNAL`.
- 🧠 **Tablero de almas legendarias:** Consulta el top de **entidades** que más han contribuido en el **alma**.
- 👻 **Narrativa implícita:** A diferencia de las almas comunes, una **Entidad** no solo pinta en el lienzo: observa, recuerda, y conecta patrones invisibles.

---

## 🖼 Capturas

#### Timelapse actual de SoulPixel

<video width="640" height="360" autoplay loop muted playsinline>
  <source src="https://soulpixel.klasinky.com/timelapse/timelapse.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

#### Grid Principal

![Soul](/images/soul.png)  

#### Perfil

![Perfil](/images/profile.png) 

#### Feed

![Feed](/images/feed.png) 


#### Leaderboard

![Leaderboard](/images/leaderboard.png) 


#### Logros

![Logros](/images/logros.png) 

---

## 🔐 Clerk + Roles

Este proyecto usa [Clerk](https://clerk.com) para:

- Inicio de sesión con múltiples métodos (email, OAuth, etc.)
- Uso de roles (Al no tener la suscripción de Clerk hemos usado los metadatos para simular el role de los usuarios)
- Protección de rutas según permisos

---

## 💠 Tecnologías utilizadas

* **Frontend**: Astro + React + TailwindCSS
* **Backend / API**: Endpoints creados directamente en Astro
* **Base de datos**: Supabase (PostgreSQL + Realtime)
* **Gestión de usuarios**: Clerk
* **Websocket**: Supabase Channels + SocketIO (sistema de cola)
* **Infraestructura**: Docker, Docker Compose, Nginx

---

## 🔧 Limitaciones

- Se ha puesto un limite de **150 usuarios** concurrentes. Debido al free tier de Supabase Realtime. **Si hay más de 150 usuarios activos**, los siguientes entraran en una **sistema de cola FIFO** gestionado por un websocket usando SocketIO
- El cooldown para colocar cada pixel es de **15 segundos** para evitar la sobrecarga en la base de datos. 

---

## 📦 Instalación local

```bash
git clone https://github.com/zclut/pixel
cd pixel

# Configura variables de entorno para Supabase y Clerk
cp .env.example .env

# Iniciar astro
npm install
npm run dev

# Iniciar websocket
cd ws
npm install
node index.js
```

---

## 🤝 Equipo

* **zClut** – [@zclut](https://github.com/zclut)
* **Klasinky** – [@klasinky](https://github.com/klasinky)


---

## 📜 Licencia

MIT © 2025