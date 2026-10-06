# Backend API - Documentación Técnica

Servicio RESTful desarrollado en Node.js y Express para la gestión de prospectos (leads) y autenticación de usuarios con persistencia en MongoDB.

---

## 🚀 Requisitos Previos e Instalación

1. **Instalar dependencias:**
   ```bash
   cd api
   npm install
   ```

2. **Variables de Entorno:**
   Copia el archivo de ejemplo y completa los valores requeridos:
   ```bash
   cp .env.example .env
   ```
   Variables esperadas:
   * `PORT`: Puerto de escucha del servidor (por defecto `5000` o `3000`).
   * `MONGO_URI`: Cadena de conexión a MongoDB.
   * `JWT_SECRET`: Llave secreta para la firma de tokens JWT.
   * `JWT_EXPIRES_IN`: Tiempo de expiración del token (ej. `1d`, `7d`).
   * Credenciales de servicio de email (SMTP) configuradas para el envío en background.

3. **Iniciar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📌 Convenciones de la API

* **Base URL:** `http://localhost:3000/api` 
* **Formato de datos:** `application/json`
* **Autenticación:** Las rutas protegidas requieren el header HTTP:
  ```http
  Authorization: Bearer <tu_token_jwt>
  ```

---

## 🩺 Health Check

### Comprobar estado del servidor y base de datos
Verifica si la API está en línea y conectada a MongoDB.

* **Método:** `GET`
* **Endpoint:** `/health`
* **Autenticación:** Pública

#### Respuesta Exitosa (`200 OK`)
```json
{
  "status": "ok",
  "db": "connected"
}
```

---

## 🔐 Módulo de Autenticación (`/auth`)

### 1. Registrar usuario
Crea una cuenta de usuario en el sistema.

* **Método:** `POST`
* **Endpoint:** `/auth/register`
* **Autenticación:** Pública

#### Request Body
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```
* `email`: (string, requerido, formato email válido, máx. 150 caracteres).
* `password`: (string, requerido, mín. 6 caracteres, máx. 72 caracteres).

#### Respuesta Exitosa (`201 Created`)
```json
{
  "_id": "660c1f54b3a1a3d9e4a8b123",
  "email": "usuario@ejemplo.com"
}
```

#### Respuestas de Error
* **`400 Bad Request`** (Datos no válidos):
  ```json
  {
    "message": "Datos de usuario inválidos"
  }
  ```
* **`400 Bad Request`** (Usuario ya registrado):
  ```json
  {
    "message": "El usuario ya existe"
  }
  ```

---

### 2. Iniciar sesión (Login)
Autentica al usuario y devuelve el token JWT para sesiones protegidas.  
*Nota: Limitado a un máximo de 5 intentos por cada 15 minutos por IP.*

* **Método:** `POST`
* **Endpoint:** `/auth/login`
* **Autenticación:** Pública

#### Request Body
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```

#### Respuesta Exitosa (`200 OK`)
```json
{
  "_id": "660c1f54b3a1a3d9e4a8b123",
  "email": "usuario@ejemplo.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Respuestas de Error
* **`400 Bad Request`**:
  ```json
  {
    "message": "Email y contraseña son obligatorios"
  }
  ```
* **`401 Unauthorized`**:
  ```json
  {
    "message": "Email o contraseña incorrectos"
  }
  ```
* **`429 Too Many Requests`**:
  ```json
  {
    "message": "Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos."
  }
  ```

---

### 3. Obtener perfil autenticado
Devuelve los datos esenciales del usuario asociado al token enviado.

* **Método:** `GET`
* **Endpoint:** `/auth/me`
* **Autenticación:** Requerida (`Bearer Token`)

#### Headers
```http
Authorization: Bearer <token_jwt>
```

#### Respuesta Exitosa (`200 OK`)
```json
{
  "_id": "660c1f54b3a1a3d9e4a8b123",
  "email": "usuario@ejemplo.com"
}
```

---

## 📋 Módulo de Leads (`/leads`)

### 1. Crear nuevo Lead (Formulario de contacto)
Recepción de consultas desde la landing page o frontend público. Cuenta con campo trampa (`website`) como mecanismo honeypot antispam y despacha emails de notificación y autorespuesta en segundo plano.

* **Método:** `POST`
* **Endpoint:** `/leads`
* **Autenticación:** Pública *(con Rate Limit)*

#### Request Body
```json
{
  "nombre": "Agustín Ruarte",
  "email": "agustin@ejemplo.com",
  "tipoProyecto": "Desarrollo Web",
  "mensaje": "Hola, solicito presupuesto para el desarrollo de una plataforma.",
  "origen": "landing-page",
  "website": ""
}
```

#### Validación de campos:
* `nombre`: String (requerido, 1 a 100 caracteres).
* `email`: String (requerido, email válido, máx. 150 caracteres).
* `tipoProyecto`: String (requerido, 1 a 100 caracteres).
* `mensaje`: String (requerido, 1 a 2000 caracteres).
* `origen`: String (opcional).
* `website`: String (opcional honeypot; si contiene texto, la petición se da por exitosa sin procesar datos).

#### Respuesta Exitosa (`201 Created`)
```json
{
  "status": "ok",
  "lead": {
    "_id": "660c2394b3a1a3d9e4a8b456",
    "nombre": "Agustín Ruarte",
    "email": "agustin@ejemplo.com",
    "tipoProyecto": "Desarrollo Web",
    "mensaje": "Hola, solicito presupuesto para el desarrollo de una plataforma.",
    "origen": "landing-page",
    "estado": "nuevo",
    "createdAt": "2026-10-05T19:00:00.000Z"
  }
}
```

#### Respuestas de Error
* **`400 Bad Request`**:
  ```json
  {
    "status": "error",
    "errors": {
      "email": ["el email no es válido"],
      "nombre": ["el nombre es obligatorio"]
    }
  }
  ```

---

### 2. Listar Leads (Paginados y Filtrados)
Consulta la lista de leads registrados con soporte de paginación y filtros por estado y regex en tipo de proyecto.

* **Método:** `GET`
* **Endpoint:** `/leads`
* **Autenticación:** Requerida (`Bearer Token`)

#### Parámetros de consulta (Query Params)
| Parámetro | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `page` | Integer | No | Página actual (default: `1`). |
| `limit` | Integer | No | Cantidad de registros por página (default: `10`, máx: `50`). |
| `tipoProyecto` | String | No | Filtro de búsqueda por texto / regex (case-insensitive). |
| `estado` | String | No | Filtrar por: `nuevo`, `contactado`, `ganado`, `perdido`. |

#### Ejemplo de Consulta
`GET /leads?page=1&limit=10&estado=nuevo`

#### Respuesta Exitosa (`200 OK`)
```json
{
  "status": "ok",
  "data": [
    {
      "_id": "660c2394b3a1a3d9e4a8b456",
      "nombre": "Agustín Ruarte",
      "email": "agustin@ejemplo.com",
      "tipoProyecto": "Desarrollo Web",
      "mensaje": "Hola, solicito presupuesto...",
      "estado": "nuevo",
      "createdAt": "2026-10-05T19:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 18,
    "currentPage": 1,
    "totalPages": 2,
    "pageSize": 10
  }
}
```

---

### 3. Estadísticas de Leads
Obtiene la cantidad total de leads agrupados por tipo de proyecto.

* **Método:** `GET`
* **Endpoint:** `/leads/stats`
* **Autenticación:** Requerida (`Bearer Token`)

#### Parámetros de consulta (Query Params)
* `estado` (opcional): Filtrar conteos por estado (`nuevo`, `contactado`, `ganado`, `perdido`).

#### Ejemplo de Consulta
`GET /leads/stats?estado=ganado`

#### Respuesta Exitosa (`200 OK`)
```json
{
  "status": "ok",
  "data": [
    {
      "tipoProyecto": "Desarrollo Web",
      "total": 8
    },
    {
      "tipoProyecto": "Consultoría",
      "total": 3
    }
  ]
}
```

---

### 4. Actualizar Estado de un Lead
Modifica la etapa del pipeline comercial de un prospecto.

* **Método:** `PATCH`
* **Endpoint:** `/leads/:id`
* **Autenticación:** Requerida (`Bearer Token`)

#### Parámetros de ruta (Path Params)
* `id`: MongoDB ObjectId válido del lead.

#### Request Body
```json
{
  "estado": "contactado"
}
```
*Valores permitidos para `estado`:* `"nuevo"`, `"contactado"`, `"ganado"`, `"perdido"`.

#### Respuesta Exitosa (`200 OK`)
```json
{
  "status": "ok",
  "lead": {
    "_id": "660c2394b3a1a3d9e4a8b456",
    "nombre": "Agustín Aparicio",
    "estado": "contactado"
  }
}
```

#### Respuestas de Error
* **`400 Bad Request`** (ID no válido en Mongo o estado no permitido):
  ```json
  {
    "status": "error",
    "message": "Estado inválido. Los valores permitidos son: nuevo, contactado, ganado, perdido"
  }
  ```
* **`404 Not Found`**:
  ```json
  {
    "status": "error",
    "message": "Lead no encontrado"
  }
  ```
## Colección de Postman

Puedes importar la colección completa de endpoints con ejemplos de peticiones y respuestas:
* Archivo: [`postman/postman_collection.json`](./postman/postman_collection.json)
* Importación: En Postman, pulsa **Import** y selecciona el archivo.
* Configura la variable de entorno `base_url` si tu servidor corre en un puerto distinto al `3000`.




---