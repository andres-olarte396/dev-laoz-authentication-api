# 🚀 API de Autenticación (Auth API)

La API de Autenticación permite gestionar la autenticación de usuarios, asignación de roles y permisos. Utiliza JWT (JSON Web Tokens) para la autenticación y MongoDB como base de datos para almacenar los usuarios y sus datos asociados.

## 📂 **Estructura del Proyecto**

```plaintext
📂 auth-api/
├── 📂 config/
│   └── 📄 db.js                    # Configuración de conexión a MongoDB
│   └── 📄 swagger.js               # Configuración de swagger para documentar, crear, definir y consumir APIs.
├── 📂 controllers/
│   └── 📄 authController.js        # Controladores para registro, login y gestión de usuarios
├── 📂 middleware/
│   ├── 📄 authMiddleware.js        # Middleware para proteger rutas con JWT
│   └── 📄 permissionsMiddleware.js # Middleware para verificar permisos de usuarios
├── 📂 models/
│   └── 📄 User.js                  # Modelo de datos de usuario (roles y permisos)
├── 📂 routes/
│   └── 📄 authRoutes.js            # Rutas de autenticación y autorización
├── 📄 server.js                    # Archivo principal que configura y corre el servidor
├── 📄 .env                         # Variables de entorno (configuración)
└── 📄 package.json                 # Dependencias y scripts del proyecto
```

---

## 🛠️ **Instalación**

1. Clona este repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd auth-api
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env`:

   ```plaintext
   MONGO_URI=mongodb://localhost:27017/auth-api
   JWT_SECRET=your_jwt_secret_key
   PORT=4000
   ```

4. Inicia el servidor:

   ```bash
   npm start
   ```

   La API estará disponible en el puerto configurado (por defecto `4000`).

---

## 🔐 **Rutas Disponibles**

### 🔑 **Autenticación**

- **`POST /api/auth/login`**

  Inicia sesión con credenciales de usuario y devuelve un token JWT.

  **Body:**

  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```

  **Respuesta:**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **`POST /api/auth/refresh`**

  Permite obtener un nuevo access token usando un refresh token válido.

  **Body:**

  ```json
  {
    "refreshToken": "<refresh_token_válido>"
  }
  ```

  **Respuesta exitosa:**

  ```json
  {
    "token": "<nuevo_access_token>"
  }
  ```
  
  **Errores posibles:**

  - 400: Falta el refresh token `{ "error": "Refresh token requerido" }`
  - 401: Token inválido o expirado `{ "error": "Refresh token inválido o expirado" }`

---

## 👨‍💻 **Desarrollo**

1. Asegúrate de que **MongoDB** esté corriendo localmente o configura una URI válida en el archivo `.env`.

2. Para probar localmente, usa herramientas como **Postman** o **cURL** para realizar solicitudes a la API.

---

## 🔐 **Autenticación y Uso de JWT**

### **Cómo Funciona**

1. **Registro:** Un usuario se registra con un `username`, `password`, un `role`, y una lista de `permissions`.
2. **Inicio de Sesión:** Al iniciar sesión, se genera un token JWT con los datos del usuario, incluyendo su rol y permisos.
3. **Validación del Token:** El token debe ser enviado en la cabecera de cada solicitud protegida.  
   **Ejemplo:**

   ```plaintext
   Authorization: Bearer <token>
   ```

4. **Autorización Basada en Permisos:** Las rutas protegidas verifican si el usuario tiene los permisos necesarios antes de permitir el acceso.

---

## 🕸 **Middleware**

- **`authMiddleware.js`**

  Valida el token JWT y verifica si es válido.

- **`permissionsMiddleware.js`**

  Verifica si el usuario tiene los permisos requeridos para acceder a la ruta solicitada.

---

## 🧪 **Pruebas**

### **Registrar un Usuario**

```bash
curl -X POST http://localhost:4000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "password123",
  "role": "admin",
  "permissions": ["read", "write", "delete"]
}'
```

### **Iniciar Sesión**

```bash
curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "password123"
}'
```

### **Acceder a un Recurso Protegido**

```bash
curl -X GET http://localhost:4000/api/auth/read \
-H "Authorization: Bearer <token>"
```

### **Refresh Token**

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
-H "Content-Type: application/json" \
-d '{
  "refreshToken": "<refresh_token_válido>"
}'
```

---

## 🪧 **Tecnologías Utilizadas**

- **Node.js**: Plataforma para construir la API.
- **Express.js**: Framework para manejar rutas y middlewares.
- **MongoDB**: Base de datos para almacenar usuarios.
- **jsonwebtoken**: Biblioteca para la generación y validación de tokens JWT.
- **dotenv**: Manejo de variables de entorno.

---

## 👨‍💻 **Contribuciones**

Si deseas contribuir a este proyecto, realiza un fork del repositorio, haz tus cambios y envía un pull request.

---

## 📜 **Licencia**

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 🔄 Endpoint de Refresh Token

- **`POST /api/auth/refresh`**

  Permite obtener un nuevo access token usando un refresh token válido.

  **Body:**

  ```json
  {
    "refreshToken": "<refresh_token_válido>"
  }
  ```

  **Respuesta exitosa:**

  ```json
  {
    "token": "<nuevo_access_token>"
  }
  ```
  
  **Errores posibles:**

  - 400: Falta el refresh token `{ "error": "Refresh token requerido" }`
  - 401: Token inválido o expirado `{ "error": "Refresh token inválido o expirado" }`

---

## 🛡️ Mejoras de Seguridad y Calidad

- Validación de datos de entrada con `express-validator` en los endpoints.
- Límite de intentos de login por IP (rate limit) para evitar ataques de fuerza bruta.
- El JWT ahora contiene el `userId` y el `sessionToken` como claims.
- Se implementa refresh token para sesiones seguras y renovables.
- Pruebas automáticas robustas para login y refresh token.

---

## 🧪 Pruebas Automáticas

El proyecto incluye pruebas con Jest y Supertest para los endpoints principales:
- Login exitoso, credenciales inválidas y datos incompletos.
- Refresh token válido, inválido y ausente.

Para ejecutar los tests:
```bash
npm test
```
