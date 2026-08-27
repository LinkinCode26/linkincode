# LinkinCode

Global Software Solutions. Desarrollo de software a medida: landing pages, e-commerce, aplicaciones web, sistemas de gestión y APIs.

## Estructura del repositorio

Este es un monorepo con el frontend y el backend en carpetas separadas.

```
linkincode/
├── client/     # Frontend (React + Vite + Tailwind CSS v4)
└── api/        # Backend (Node.js + Express + MongoDB)
```

## Stack técnico

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express 5, MongoDB con Mongoose
- **Seguridad:** Helmet, CORS
- **Control de versiones:** Git + GitHub, con PRs y code review obligatorio antes de mergear a `develop`

## Cómo levantar el proyecto en local

### Requisitos previos

- Node.js (v18 o superior)
- npm

### Frontend (`client/`)

```bash
cd client
npm install
npm run dev
```

El proyecto levanta en `http://localhost:5173` por defecto.

### Backend (`api/`)

```bash
cd api
npm install
npm run dev
```

El servidor levanta en el puerto definido en `.env` (por defecto `3000`). Podés confirmar que está corriendo entrando a `http://localhost:3000/api/health`.

Cada carpeta tiene su propio `package.json` y sus propias dependencias, así que hay que correr `npm install` en cada una por separado.

## Variables de entorno

### Backend (`api/.env.example`)

```
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre_db>?retryWrites=true&w=majority
```

Copiá `.env.example` a `.env` en la carpeta `api/` y completá los valores con tu propio usuario de MongoDB Atlas. Usá un nombre de base de datos distinto por cada integrante del equipo (por ejemplo `linkincode_thomas`, `linkincode_angel`) para no pisarse datos entre sí mientras desarrollan en local. El archivo `.env` real nunca se sube al repositorio (está en `.gitignore`), y las credenciales se comparten por un canal aparte, no por el chat general del equipo.

### Frontend (`client/`)

Por ahora el frontend no requiere variables de entorno propias. Cuando se conecte con la API real, se va a documentar acá la variable correspondiente (por ejemplo `VITE_API_URL`).

## Flujo de trabajo

- Cada tarea nace como una card en Trello.
- Se trabaja en una rama por feature, a partir de `develop`: `feature/nombre-de-la-tarea` o `fix/nombre-del-bug`.
- Al terminar, se abre un PR contra `develop` con el título `[FEATURE]: descripción corta` y una descripción clara de los cambios, en items.
- El PR necesita al menos 1 approval de otro integrante del equipo antes de poder mergear.
- La rama `develop` está protegida: no se permite push directo.
- Daily todos los días a las 17:30.

## Equipo

Proyecto fundado y desarrollado por Thomas Bretschneider, Angel, Santiago y Jorge.