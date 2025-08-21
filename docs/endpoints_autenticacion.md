# Documentación de Endpoints - Módulo de Autenticación

## POST /api/auth/login

Inicia sesión de usuario y retorna un access token y un refresh token.

**Request Body:**

```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuestas:**

- 200 OK

  ```json
  {
    "token": "<access_token>",
    "refreshToken": "<refresh_token>"
  }
  ```

- 400 Bad Request

  ```json
  { "error": "Datos incompletos" }
  ```

- 401 Unauthorized+

  ```json
  { "error": "Invalid credentials" }
  ```

- 429 Too Many Requests

  ```json
  { "error": "Demasiados intentos de login, intenta más tarde." }
  ```

---

## POST /api/auth/refresh

Obtiene un nuevo access token usando un refresh token válido.

**Request Body:**

```json
{
  "refreshToken": "<refresh_token>"
}
```

**Respuestas:**

- 200 OK

  ```json
  { "token": "<nuevo_access_token>" }
  ```

- 400 Bad Request

  ```json
  { "error": "Refresh token requerido" }
  ```

- 401 Unauthorized

  ```json
  { "error": "Refresh token inválido o expirado" }
  ```

---

## (Opcional) POST /api/auth/logout

Cierra la sesión del usuario e invalida los tokens.

**Request Body:**

```json
{
  "refreshToken": "<refresh_token>"
}
```

**Respuestas:**

- 200 OK

  ```json
  { "message": "Sesión cerrada correctamente" }
  ```

- 400 Bad Request

  ```json
  { "error": "Refresh token requerido" }
  ```

---

## Seguridad y Consideraciones

- Todos los endpoints usan HTTPS.
- El access token debe enviarse en la cabecera Authorization: `Bearer <token>` para acceder a rutas protegidas.
- El refresh token solo se usa en el endpoint de refresh/logout y nunca debe enviarse en headers.
- Los mensajes de error son claros y ayudan al usuario a corregir su solicitud.

---

## Ejemplo de uso con curl

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{ "username": "usuario", "password": "contraseña" }'
```

### Refresh Token

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
-H "Content-Type: application/json" \
-d '{ "refreshToken": "<refresh_token>" }'
```

### Logout (opcional)

```bash
curl -X POST http://localhost:4000/api/auth/logout \
-H "Content-Type: application/json" \
-d '{ "refreshToken": "<refresh_token>" }'
```
