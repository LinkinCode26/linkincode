# Guía de deploy

Cómo publicar LinkinCode en producción y cómo funciona el deploy automático. Está pensada para que cualquiera del equipo pueda configurarlo desde cero o diagnosticar un problema.

## Índice

1. [Visión general](#1-visión-general)
2. [Requisitos previos](#2-requisitos-previos)
3. [Base de datos: MongoDB Atlas](#3-base-de-datos-mongodb-atlas)
4. [Backend: Render](#4-backend-render)
5. [Frontend: Vercel](#5-frontend-vercel)
6. [Secrets de GitHub Actions](#6-secrets-de-github-actions)
7. [CORS y dominios](#7-cors-y-dominios)
8. [Primer deploy](#8-primer-deploy)
9. [Deploys del día a día](#9-deploys-del-día-a-día)
10. [Verificación post-deploy](#10-verificación-post-deploy)
11. [Rollback](#11-rollback)
12. [Problemas frecuentes](#12-problemas-frecuentes)
13. [Rotar credenciales](#13-rotar-credenciales)

---

## 1. Visión general

```
                    merge a main
                         │
                         ▼
                ┌─────────────────┐
                │  Tests (ci.yml) │  lint + build front, lint + tests back
                └────────┬────────┘
                         │ solo si pasan
            ┌────────────┴────────────┐
            ▼                         ▼
   Deploy backend (Render)    Deploy frontend (Vercel)
   Deploy Hook + commit SHA   vercel pull → build → deploy --prebuilt

   Render ◄──────── API ────────► MongoDB Atlas
   Vercel ──── VITE_API_URL ───► Render
```

Puntos clave:

- **Un solo disparador**: el push (merge) a `main`. Ni Render ni Vercel despliegan por su cuenta.
- **Los tests son una compuerta**: si fallan, no se despliega nada.
- **Se despliega el commit exacto que pasó los tests**: el backend recibe el SHA en el hook y el frontend se compila dentro de GitHub Actions.
- **Un deploy a la vez**: si llegan dos merges seguidos, el segundo espera al primero (`concurrency` en `cd.yml`).

---

## 2. Requisitos previos

Cuentas y permisos necesarios:

| Servicio | Para qué | Qué necesitás |
| :--- | :--- | :--- |
| GitHub | Código y Actions | Permiso de admin en el repo (para cargar secrets y proteger ramas). |
| MongoDB Atlas | Base de datos | Un proyecto y un cluster. |
| Render | Backend | Cuenta conectada al repo de GitHub. |
| Vercel | Frontend | Cuenta conectada al repo de GitHub. |
| Proveedor de mail | Avisos de leads | Credenciales SMTP (ver [advertencia sobre Render](#advertencia-smtp-en-render)). |
| Registrador del dominio | DNS | Acceso para crear registros DNS. |

Herramientas locales (solo para tareas puntuales como crear el primer admin): Node.js 20+, npm y `openssl`.

---

## 3. Base de datos: MongoDB Atlas

1. En Atlas, creá un cluster (el plan gratuito alcanza para empezar).
2. **Database Access** → *Add New Database User*. Creá un usuario con contraseña propia para producción (no reutilices el de desarrollo) y permiso de lectura y escritura sobre la base.
3. **Network Access** → *Add IP Address*. Render no tiene una IP fija en los planes gratuitos, así que hay que permitir `0.0.0.0/0`. La protección real son el usuario y la contraseña, por eso conviene que sean largos y únicos.
4. **Connect** → *Drivers* y copiá la cadena de conexión. Reemplazá `<usuario>`, `<password>` y agregá el nombre de la base antes del `?`:

   ```
   mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/linkincode?retryWrites=true&w=majority
   ```

   Si la contraseña tiene caracteres especiales (`@`, `:`, `/`, `#`), hay que codificarlos en formato URL (por ejemplo `@` → `%40`).
5. Guardá esta cadena: es el valor de `MONGODB_URI` en Render.

Usá una base distinta para producción (por ejemplo `linkincode`) y no la compartas con las de desarrollo.

---

## 4. Backend: Render

### 4.1 Crear el servicio

1. En Render: **New +** → **Web Service** → elegí el repositorio.
2. Completá:

   | Campo | Valor |
   | :--- | :--- |
   | Name | El que prefieras, por ejemplo `linkincode-api`. Define la URL `https://<name>.onrender.com`. |
   | Region | La más cercana a la mayoría de los usuarios. |
   | Branch | `main` |
   | Root Directory | `api` |
   | Runtime | Node |
   | Build Command | `npm ci` |
   | Start Command | `npm start` |
   | Instance Type | Ver [advertencia SMTP](#advertencia-smtp-en-render) antes de elegir. |

3. En **Advanced**:
   - **Health Check Path**: `/api/health`.
   - **Auto-Deploy**: **No**. Este paso es obligatorio. Si queda en *Yes*, Render desplegaría por su cuenta en cada push, saltándose los tests, y además duplicaría los deploys que dispara el CD.

### 4.2 Variables de entorno

En **Environment**, cargá:

| Variable | Valor |
| :--- | :--- |
| `NODE_VERSION` | `20` |
| `MONGODB_URI` | La cadena del [paso 3](#3-base-de-datos-mongodb-atlas). |
| `JWT_SECRET` | Un valor largo y aleatorio. Generalo con `openssl rand -hex 48`. |
| `JWT_EXPIRES_IN` | `1d` (opcional). |
| `SMTP_HOST` | Ej: `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | Usuario SMTP. |
| `SMTP_PASS` | Contraseña o app password. |
| `EMAIL_FROM` | Ej: `"LinkinCode <contacto@linkincode.com>"` |
| `TEAM_EMAIL` | Casilla que recibe los avisos de leads. |

No definas `PORT`: Render lo asigna solo y la app lo lee de `process.env.PORT`.

Usá un `JWT_SECRET` distinto al de desarrollo. Si se filtra, cualquiera podría firmar tokens de admin válidos.

### 4.3 Advertencia: SMTP en Render

Desde el 26 de septiembre de 2025, los web services **gratuitos** de Render bloquean el tráfico saliente a los puertos SMTP 25, 465 y 587. Con la configuración actual (`smtp.gmail.com:465`), en el plan gratuito los mails fallan por timeout.

Qué pasa en ese caso: el lead **sí se guarda** (los mails se envían en segundo plano y un fallo no afecta la respuesta), pero **no llegan ni el aviso al equipo ni la auto-respuesta al cliente**. En los logs de Render vas a ver `[Email Error]`.

Opciones:

- **Pasar el servicio a un plan pago**, que habilita los puertos 465 y 587. No requiere cambios de código.
- **Usar un proveedor de mail con API HTTP** (Resend, SendGrid, Brevo, Mailgun, etc.) en lugar de SMTP. Requiere cambiar `api/services/emailService.js`.

Mientras no se resuelva, revisá los leads desde el panel `/admin`.

### 4.4 Cold starts

En el plan gratuito, Render apaga el servicio tras un rato sin tráfico. La primera request posterior puede tardar hasta alrededor de un minuto. Para el formulario de contacto significa que el primer envío del día puede ser lento. Un plan pago evita este comportamiento.

### 4.5 Obtener el Deploy Hook

1. En el servicio: **Settings** → **Deploy Hook**.
2. Copiá la URL. Tiene esta forma:

   ```
   https://api.render.com/deploy/srv-xxxxxxxx?key=yyyyyyyy
   ```

3. Guardala para cargarla como secret `RENDER_DEPLOY_HOOK_URL` en el [paso 6](#6-secrets-de-github-actions).

El workflow le agrega `&ref=<SHA>` al final, por eso la URL debe incluir ya el `?key=...`. Tratala como una credencial: quien la tenga puede disparar deploys.

---

## 5. Frontend: Vercel

### 5.1 Crear el proyecto

1. En Vercel: **Add New…** → **Project** → importá el repositorio.
2. Configurá:

   | Campo | Valor |
   | :--- | :--- |
   | Framework Preset | Vite |
   | **Root Directory** | `client` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

   El Root Directory es obligatorio: el workflow corre `vercel` desde la raíz del repo y depende de esta configuración para encontrar el frontend.

3. Cargá la variable de entorno para **Production**:

   | Variable | Valor |
   | :--- | :--- |
   | `VITE_API_URL` | `https://<tu-servicio>.onrender.com/api` |

   Debe terminar en `/api` y apuntar a la URL real de Render. Es una variable de **build**: si la cambiás, hay que volver a desplegar.

4. Podés cancelar el primer deploy automático que Vercel lanza al importar. Después, los deploys los hace el CD.

### 5.2 Por qué no despliega solo

`client/vercel.json` incluye:

```json
"git": { "deploymentEnabled": { "main": false } }
```

Esto desactiva el deploy automático de Vercel al pushear a `main`. Así el único camino a producción es el CD, después de los tests. El mismo archivo define el rewrite que envía todas las rutas a `index.html`, necesario para que `/admin` y `/admin/login` funcionen al recargar la página.

### 5.3 Obtener los IDs y el token

El CD necesita tres valores de Vercel:

- **`VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`**: desde la raíz del repo, con la CLI instalada (`npm i -g vercel`):

  ```bash
  vercel link
  cat .vercel/project.json
  ```

  El archivo muestra `orgId` y `projectId`. La carpeta `.vercel/` está en `.gitignore`: no se sube al repo. Los IDs también aparecen en *Project Settings → General*.

- **`VERCEL_TOKEN`**: en Vercel, *Account Settings* → **Tokens** → *Create*. Ponele un nombre reconocible (por ejemplo `github-actions-linkincode`) y copiá el valor al momento: no se vuelve a mostrar.

---

## 6. Secrets de GitHub Actions

En el repo: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Cargá estos cuatro:

| Secret | Origen |
| :--- | :--- |
| `RENDER_DEPLOY_HOOK_URL` | [Paso 4.5](#45-obtener-el-deploy-hook) |
| `VERCEL_TOKEN` | [Paso 5.3](#53-obtener-los-ids-y-el-token) |
| `VERCEL_ORG_ID` | [Paso 5.3](#53-obtener-los-ids-y-el-token) |
| `VERCEL_PROJECT_ID` | [Paso 5.3](#53-obtener-los-ids-y-el-token) |

El CI no necesita secrets propios: los tests usan una base en memoria y el workflow ya define un `JWT_SECRET` de prueba.

Recomendación adicional: en **Settings → Branches**, protegé `main` igual que `develop` (PR obligatorio, 1 approval y CI en verde). Así nada llega a producción sin revisión.

---

## 7. CORS y dominios

### 7.1 Orígenes permitidos

La API solo acepta llamadas desde los orígenes listados en `api/app.js`:

```js
const allowedOrigins = [
  "https://linkincode.com",
  "https://www.linkincode.com",
  "https://linkincodepage.vercel.app",
  "http://localhost:5173",
];
```

Si el sitio se sirve desde un dominio que no está en la lista, el navegador recibe un error de CORS y el formulario y el login dejan de funcionar. Para agregar un dominio hay que editar esa lista, mergear a `main` y esperar el deploy del backend.

Dos cosas a tener en cuenta:

- La variable `CORS_ORIGINS` de `.env.example` **no se usa**. No sirve para agregar dominios.
- Los *preview deployments* de Vercel (`*.vercel.app` con URLs distintas) no están en la lista, así que no pueden hablar con la API de producción.

### 7.2 Dominio propio en Vercel

1. En el proyecto de Vercel: **Settings** → **Domains** → agregá `linkincode.com` y `www.linkincode.com`.
2. Vercel muestra los registros DNS a crear. Cargalos en tu registrador (normalmente un registro `A` para el dominio raíz y un `CNAME` para `www`; usá los valores exactos que indique Vercel).
3. Esperá a que el estado cambie a *Valid Configuration*. Puede tardar desde minutos hasta unas horas por la propagación DNS.

---

## 8. Primer deploy

Con todo configurado, seguí este orden:

1. **Backend**: hacé un deploy manual la primera vez. En Render, **Manual Deploy** → *Deploy latest commit*. Confirmá que arranca (ver logs) y que `https://<servicio>.onrender.com/api/health` responde `{"status":"ok","db":"connected"}`.
2. **Frontend**: verificá que `VITE_API_URL` apunta a esa URL.
3. **Pipeline**: mergeá un PR a `main` (o hacé un commit trivial) y mirá la pestaña **Actions** → *CD Pipeline*. Deben ejecutarse en orden `Tests` → `Deploy backend (Render)` y `Deploy frontend (Vercel)`.
4. **Crear el primer admin**. El endpoint de registro exige un token de admin, así que el primero se crea con el script. Los planes gratuitos de Render no incluyen shell, por eso se hace desde tu máquina apuntando a la base de producción:

   ```bash
   cd api
   MONGODB_URI="<cadena-de-produccion>" npm run create-admin -- admin@linkincode.com "UnaPasswordSegura"
   ```

   La variable pasada en la línea de comandos tiene prioridad sobre el `.env` local. Usá una contraseña fuerte (mínimo 6 caracteres, pero conviene mucho más) y, si tu shell guarda historial, limpialo después o usá un espacio inicial según tu configuración. Para crear más admins, usá el endpoint `POST /api/auth/register` con el token de uno existente.

   No ejecutes `seed:leads` contra producción: crea leads de prueba.
5. Seguí con la [verificación post-deploy](#10-verificación-post-deploy).

---

## 9. Deploys del día a día

1. Trabajá en una rama `feature/...` o `fix/...` a partir de `develop`.
2. Abrí PR hacia `develop`. El CI corre solo; necesitás 1 approval y el CI en verde.
3. Para publicar, abrí un PR de `develop` hacia `main`. El CI vuelve a correr.
4. Al mergear a `main`, el CD arranca solo:
   - Corre los tests (reutiliza `ci.yml`).
   - Si pasan, dispara el deploy del backend y el deploy del frontend en paralelo.
5. Seguí el progreso en **Actions** y verificá el resultado en Render y Vercel.

Detalles útiles:

- **El job de Render termina cuando Render acepta el hook, no cuando termina el build.** Un check verde en Actions no garantiza que el backend esté arriba: confirmalo en el dashboard de Render (*Events*) o con el health check.
- **Reintentar un deploy**: en **Actions**, abrí la ejecución del *CD Pipeline* y usá **Re-run all jobs** (o *Re-run failed jobs*). El workflow no tiene disparador manual (`workflow_dispatch`); si el equipo lo quiere, se puede agregar al `on:` de `cd.yml`.
- **Cambios de variables de entorno**:
  - Render: al guardar, el servicio se reinicia con los nuevos valores.
  - Vercel: `VITE_API_URL` se aplica en el próximo build, así que hay que redeplegar el frontend (re-run del CD).

---

## 10. Verificación post-deploy

Después de cada deploy importante, comprobá:

- [ ] **API viva**: `GET https://<servicio>.onrender.com/api/health` devuelve `{"status":"ok","db":"connected"}`.
- [ ] **Sitio carga**: https://linkincode.com abre sin errores en consola.
- [ ] **Recarga de rutas**: https://linkincode.com/admin/login carga al recargar la página (no da 404).
- [ ] **Login admin**: ingresás con un usuario válido y llegás a `/admin`.
- [ ] **Formulario de contacto**: enviás una consulta de prueba; responde "Mensaje enviado" y aparece en el panel `/admin`.
- [ ] **Mails**: llega el aviso a `TEAM_EMAIL` y la auto-respuesta al email de prueba (ver [advertencia SMTP](#43-advertencia-smtp-en-render)).
- [ ] **Estados**: cambiás el estado de un lead desde el panel y el cambio persiste al recargar.
- [ ] **Sin errores de CORS** en la consola del navegador.

Borrá la consulta de prueba desde la base cuando termines, o marcala como `perdido`.

---

## 11. Rollback

La regla general: **como producción solo se actualiza desde `main`, la forma más segura de volver atrás es revertir el commit en `main`** (un PR con `git revert`), y dejar que el CD despliegue la versión anterior.

Si necesitás volver atrás ya mismo, mientras preparás el revert:

- **Frontend (Vercel)**: *Deployments* → elegí un deploy anterior estable → *Promote to Production* (o *Instant Rollback*).
- **Backend (Render)**: en el servicio, pestaña *Events*/*Deploys* → deploy anterior → *Rollback*.

Ojo: un rollback manual deja producción distinta de `main` hasta que se haga el revert. Si no se revierte, el siguiente merge vuelve a desplegar lo nuevo.

Los rollbacks de código **no deshacen cambios en la base de datos**.

---

## 12. Problemas frecuentes

| Síntoma | Causa probable | Qué hacer |
| :--- | :--- | :--- |
| Job de Render falla con `Falta el secret RENDER_DEPLOY_HOOK_URL` | El secret no está cargado o está mal escrito. | Cargarlo en GitHub (paso 6). |
| El hook de Render responde error | URL sin `?key=`, o hook regenerado. | Copiar de nuevo la URL desde *Settings → Deploy Hook* y actualizar el secret. |
| Job de Vercel falla en `vercel pull` | `VERCEL_TOKEN`, `VERCEL_ORG_ID` o `VERCEL_PROJECT_ID` incorrectos, o token vencido. | Regenerar el token y revisar los IDs con `vercel link`. |
| Vercel compila pero no encuentra el proyecto | Root Directory distinto de `client`. | Corregir en *Project Settings → General*. |
| Render despliega solo al pushear | Auto-Deploy en *Yes*. | Cambiar a *No* (paso 4.1). |
| El sitio muestra error de red o CORS al enviar el formulario o loguearse | El dominio no está en `allowedOrigins`, o `VITE_API_URL` apunta a otra URL. | Revisar la lista en `api/app.js` y la variable en Vercel. Redesplegar. |
| Respuesta `403` con "Acceso bloqueado por política de CORS" | El origen de la request no está permitido. | Agregar el origen a `allowedOrigins`. |
| `/admin` da 404 al recargar | Falta el rewrite de `vercel.json`. | Verificar que `client/vercel.json` esté desplegado. |
| El primer envío del formulario tarda muchísimo | Cold start del plan gratuito de Render. | Esperar, o pasar a un plan pago. |
| Se guardan los leads pero no llegan mails | SMTP bloqueado en el plan gratuito de Render, o credenciales incorrectas. | Ver [paso 4.3](#43-advertencia-smtp-en-render) y los logs (`[Email Error]`). |
| En los logs: `Falta la variable de entorno MONGODB_URI` | No está cargada en Render. | Agregarla en *Environment*. |
| En los logs: error de conexión o timeout a MongoDB | IP no permitida en Atlas, o credenciales/URL incorrectas. | Revisar *Network Access* (`0.0.0.0/0`) y el usuario/contraseña de la cadena. |
| `JWT_SECRET no está definido en las variables de entorno` al loguear | Falta `JWT_SECRET` en Render. | Agregarlo. |
| Login devuelve `429` | Superó 5 intentos fallidos en 15 minutos desde esa IP. | Esperar 15 minutos. |
| Todos los usuarios comparten el límite de intentos | Problema con la IP detrás del proxy. | La app ya usa `trust proxy`; revisar si hay otro proxy delante (por ejemplo un CDN) y ajustar. |
| Las sesiones de admin se cierran solas | El token vence a los `JWT_EXPIRES_IN` (por defecto 1 día). | Comportamiento esperado; volver a iniciar sesión. |
| Cambié `VITE_API_URL` y el sitio sigue con la URL vieja | Es variable de build. | Redesplegar el frontend. |

---

## 13. Rotar credenciales

Hacelo si alguien deja el equipo o si sospechás que se filtró algo.

| Credencial | Cómo rotarla |
| :--- | :--- |
| `JWT_SECRET` | Cambiarlo en Render. **Cierra todas las sesiones activas** (los tokens anteriores dejan de ser válidos). |
| Usuario de MongoDB | Crear un usuario nuevo en Atlas, actualizar `MONGODB_URI` en Render y eliminar el anterior. |
| `SMTP_PASS` | Generar una nueva contraseña de aplicación, actualizar en Render y revocar la anterior. |
| Deploy Hook de Render | Regenerarlo en *Settings → Deploy Hook* y actualizar el secret `RENDER_DEPLOY_HOOK_URL`. |
| `VERCEL_TOKEN` | Crear un token nuevo, actualizar el secret y borrar el anterior. |
| Contraseña de un admin | Por ahora no hay endpoint para cambiarla: se crea un admin nuevo con `create-admin` y se elimina el viejo directamente en la base. |