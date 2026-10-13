# LinkinCode

Estudio de desarrollo full stack. Construimos software a medida: landing pages, e-commerce, APIs, dashboards y sistemas de gestión.

Este repositorio contiene el **sitio web público** de LinkinCode (con simuladores interactivos de cada servicio y formulario de contacto) y el **panel de administración** para gestionar las consultas (leads) que llegan desde el formulario.

---

## URLs de producción

| Servicio | URL |
| :--- | :--- |
| Sitio web | https://linkincode.com (también `www.linkincode.com` y `linkincodepage.vercel.app`) |
| Panel admin | https://linkincode.com/admin/login |
| API | `https://<TU-SERVICIO>.onrender.com/api` ← completar con la URL real de Render |
| Health check | `https://<TU-SERVICIO>.onrender.com/api/health` |

> Los dominios del sitio salen de la lista de orígenes permitidos en `api/app.js`. Si cambia el dominio, hay que actualizar esa lista (ver [guía de deploy](docs/DEPLOY.md#7-cors-y-dominios)).

---

## Funcionalidades

- **Sitio público** bilingüe (ES / EN), con tema claro y oscuro.
- **7 simuladores interactivos**: Landing, E-commerce, API REST, Dashboard, Control de stock, Gestión de personal y Facturación. Usan datos de ejemplo y no envían nada al servidor.
- **Formulario de contacto** con validación, honeypot anti-bots y límite de 5 envíos cada 15 minutos por IP. Al enviarse, guarda el lead y manda dos mails: aviso al equipo y auto-respuesta al cliente.
- **Panel de administración** (`/admin`) con login por JWT: listado paginado de leads, filtros por servicio y estado, contadores y cambio de estado (nuevo, contactado, ganado, perdido).

---

## Stack

| Capa | Tecnologías |
| :--- | :--- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router 7, Recharts, Lucide |
| Backend | Node.js 20, Express 5, Mongoose 9, Zod, JWT, bcryptjs, Nodemailer |
| Base de datos | MongoDB (Atlas) |
| Seguridad | Helmet, CORS con lista de orígenes, rate limiting, hash de contraseñas |
| Testing | Jest, Supertest, mongodb-memory-server |
| CI/CD | GitHub Actions |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (base de datos) |

---

## Estructura del repositorio

Monorepo con frontend y backend independientes. Cada carpeta tiene su propio `package.json`.

```
linkincode/
├── .github/workflows/
│   ├── ci.yml          # Lint + build (front) y lint + tests (back)
│   └── cd.yml          # Deploy a producción al mergear a main
├── api/                # Backend (Express + MongoDB)
│   ├── config/         # Conexión a la base
│   ├── controllers/    # Validación de entrada y respuestas HTTP
│   ├── middlewares/    # Auth (JWT) y rate limiting
│   ├── models/         # Modelos de Mongoose (User, Lead)
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio y envío de mails
│   ├── scripts/        # create-admin y seed-leads
│   ├── tests/          # Tests de integración
│   └── postman/        # Colección de Postman
├── client/             # Frontend (React + Vite)
│   └── src/
│       ├── components/ # UI reutilizable y simuladores
│       ├── sections/   # Secciones de la landing
│       ├── pages/      # Login y dashboard del admin
│       ├── context/    # Auth, idioma, tema, contacto
│       ├── i18n/       # Traducciones ES / EN
│       └── services/   # Cliente HTTP de la API
└── docs/
    └── DEPLOY.md       # Guía de deploy paso a paso
```

---

## Levantar el proyecto en local

### Requisitos

- **Node.js 20 o superior** (es la versión que usa el CI).
- **npm**.
- Una base **MongoDB**: un cluster gratuito de [MongoDB Atlas](https://www.mongodb.com/atlas) o una instancia local.
- Opcional: una cuenta de Gmail con [contraseña de aplicación](https://support.google.com/accounts/answer/185833) para probar el envío de mails.

### 1. Clonar e instalar

```bash
git clone <URL-DEL-REPO>
cd linkincode

cd api && npm install
cd ../client && npm install
```

### 2. Configurar el backend

```bash
cd api
cp .env.example .env
```

Completá `api/.env` con tus valores (ver [variables de entorno](#variables-de-entorno)). Usá un nombre de base distinto por integrante (por ejemplo `linkincode_thomas`) para no pisarse datos.

> Si no configurás el SMTP, la app funciona igual: los leads se guardan y los errores de mail solo se registran en consola.

### 3. Crear un usuario administrador

El endpoint `POST /api/auth/register` exige un token de admin, así que el **primer** admin se crea con el script:

```bash
cd api
npm run create-admin -- admin@ejemplo.com MiPassword123
```

La contraseña debe tener al menos 6 caracteres.

### 4. Levantar backend y frontend

En dos terminales:

```bash
# Terminal 1: API en http://localhost:3000
cd api
npm run dev

# Terminal 2: sitio en http://localhost:5173
cd client
npm run dev
```

Verificá que la API responde en http://localhost:3000/api/health. Debería devolver `{"status":"ok","db":"connected"}`.

En desarrollo, Vite redirige las llamadas a `/api` hacia `http://localhost:3000`, así que **el frontend no necesita variables de entorno en local**.

### 5. (Opcional) Cargar leads de prueba

```bash
cd api
npm run seed:leads            # crea 30 leads de prueba (origen "seed-qa")
npm run seed:leads -- --clean # los elimina
```

---

## Variables de entorno

### Backend (`api/.env`)

| Variable | Obligatoria | Descripción |
| :--- | :---: | :--- |
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB. |
| `JWT_SECRET` | Sí | Clave para firmar los tokens. Usar un valor largo y aleatorio. |
| `JWT_EXPIRES_IN` | No | Vida del token. Por defecto `1d`. |
| `PORT` | No | Puerto del servidor. Por defecto `3000`. En Render lo define la plataforma. |
| `SMTP_HOST` | No | Servidor SMTP. Por defecto `smtp.gmail.com`. |
| `SMTP_PORT` | No | Puerto SMTP. Por defecto `465`. |
| `SMTP_SECURE` | No | `true` para conexión TLS directa (puerto 465). |
| `SMTP_USER` | Para mails | Usuario SMTP. |
| `SMTP_PASS` | Para mails | Contraseña o app password. |
| `EMAIL_FROM` | Para mails | Remitente, ej: `"LinkinCode <contacto@empresa.com>"`. |
| `TEAM_EMAIL` | Para mails | Casilla que recibe el aviso de cada lead nuevo. |

> `CORS_ORIGINS` aparece en `.env.example`, pero **el código no la lee**: los orígenes permitidos están escritos en `api/app.js`.

Para generar un `JWT_SECRET`:

```bash
openssl rand -hex 48
```

### Frontend (`client/`)

| Variable | Dónde se usa | Descripción |
| :--- | :--- | :--- |
| `VITE_API_URL` | Build de producción | URL base de la API, ej: `https://mi-api.onrender.com/api`. Si no se define, usa `/api` (proxy de Vite en desarrollo). |

`VITE_API_URL` se resuelve **en tiempo de build**: si cambia, hay que volver a desplegar el frontend.

El archivo `.env` real nunca se sube al repositorio. Las credenciales se comparten por un canal privado, no por el chat general.

---

## Scripts disponibles

### Backend (`api/`)

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor con recarga automática (nodemon). |
| `npm start` | Servidor en modo producción. |
| `npm test` | Tests de integración con Jest. |
| `npm run lint` | ESLint. |
| `npm run create-admin -- <email> <password>` | Crea un usuario admin. |
| `npm run seed:leads` | Carga o limpia leads de prueba. |

### Frontend (`client/`)

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo de Vite. |
| `npm run build` | Build de producción en `client/dist`. |
| `npm run preview` | Sirve el build localmente. |
| `npm run lint` | ESLint (incluye reglas de accesibilidad). |

---

## API

Resumen de endpoints. La documentación completa, con ejemplos de request y response, está en [`api/README.md`](api/README.md), y hay una colección importable en [`api/postman/postman_collection.json`](api/postman/postman_collection.json).

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Público | Estado del servidor y de la base. |
| `POST` | `/api/auth/login` | Público | Inicia sesión y devuelve el token. Máx. 5 intentos fallidos cada 15 min por IP. |
| `POST` | `/api/auth/register` | Admin | Crea otro usuario admin. |
| `GET` | `/api/auth/me` | Admin | Datos del usuario autenticado. |
| `POST` | `/api/leads` | Público | Recibe el formulario de contacto. Máx. 5 envíos cada 15 min por IP. |
| `GET` | `/api/leads` | Admin | Lista leads con paginación y filtros. |
| `GET` | `/api/leads/stats` | Admin | Cantidad de leads por tipo de proyecto. |
| `PATCH` | `/api/leads/:id` | Admin | Cambia el estado de un lead. |

Las rutas de admin requieren el header `Authorization: Bearer <token>`.

---

## Tests y calidad

```bash
cd api && npm test       # usa una MongoDB en memoria, no toca tu base
cd api && npm run lint
cd client && npm run lint
cd client && npm run build
```

La primera vez que corran los tests, `mongodb-memory-server` descarga un binario de MongoDB, así que necesita conexión a internet y puede demorar.

El mismo conjunto de chequeos corre en GitHub Actions en cada PR (ver abajo).

---

## CI/CD

- **`ci.yml`**: corre en cada PR hacia `develop` o `main`. Frontend: lint y build. Backend: lint y tests.
- **`cd.yml`**: corre al mergear a `main`. Primero ejecuta el CI completo y, si pasa, despliega el backend en Render y el frontend en Vercel. Si los tests fallan, no se despliega nada.

Los pasos para configurar los servicios, los secrets de GitHub y cómo verificar un deploy están en la **[guía de deploy](docs/DEPLOY.md)**.

---

## Flujo de trabajo

- Cada tarea nace como una card en Trello.
- Se trabaja en una rama por feature a partir de `develop`: `feature/nombre-de-la-tarea` o `fix/nombre-del-bug`.
- Al terminar se abre un PR hacia `develop` con el título `[FEATURE]: descripción corta` y una descripción clara de los cambios, en ítems.
- El PR necesita al menos 1 approval de otro integrante y que el CI esté en verde.
- `develop` está protegida: no se permite push directo.
- Para publicar, se abre un PR de `develop` hacia `main`. Al mergearlo se despliega a producción automáticamente.
- Daily todos los días a las 17:30.

---

## Equipo

Proyecto fundado y desarrollado por Santiago Molina, Thomas Bretschneider, Agustín Aparicio y Angel Berretta.