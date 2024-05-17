## Carlos Feature Flags 

Aplicación de ejemplo utilizando Express, MongoDB, JWT para autenticación e implementación de feature flags. El proyecto permite el registro y autenticación de usuarios, así como la activación y desactivación de feature flags para usuarios específicos. Además, incluye rutas protegidas que cambian su comportamiento basado en el estado del feature falg.

### Endpoints

#### Registro de Usuario

- **Método:** `POST`
- **Ruta:** `/register`
- **Descripción:** Registra un nuevo usuario.
- **Cuerpo de la Petición:**
    ```json
    {
        "username": "tu_usuario",
        "password": "tu_contraseña",
        "role": "user"
    }
    ```
- **Respuesta Exitosa:** `201 Created`
- **Respuesta Errónea:** `400 Bad Request`

#### Inicio de Sesión

- **Método:** `POST`
- **Ruta:** `/login`
- **Descripción:** Inicia sesión con un usuario existente.
- **Cuerpo de la Petición:**
    ```json
    {
        "username": "tu_usuario",
        "password": "tu_contraseña"
    }
    ```
- **Respuesta Exitosa:** 
    ```json
    {
        "token": "<tu_token_jwt>"
    }
    ```
- **Respuesta Errónea:** `400 Bad Request`

#### Ruta Protegida

- **Método:** `GET`
- **Ruta:** `/`
- **Descripción:** Ruta protegida que devuelve una versión de la página según el estado del feature flag del usuario.
- **Encabezados de la Petición:**
    ```sh
    Authorization: Bearer <tu_token_jwt>
    ```
- **Respuesta Exitosa:** 
    - Si el feature flag está habilitado:
        ```html
        <html><body><h1>Carlos Feature Flags New Version</h1></body></html>
        ```
    - Si el feature flag está deshabilitado:
        ```html
        <html><body><h1>Carlos Feature Flags Old Version</h1></body></html>
        ```
- **Respuesta Errónea:** 
    - `401 Unauthorized` si el token es inválido o está ausente.

#### Actualizar el Feature Flag de un Usuario

- **Método:** `PUT`
- **Ruta:** `/user/:id/flag`
- **Descripción:** Actualiza el feature flag de un usuario específico.
- **Parámetros de la Ruta:** `:id` (ID del usuario)
- **Encabezados de la Petición:**
    ```sh
    Authorization: Bearer <tu_token_jwt>
    ```
- **Cuerpo de la Petición:**
    ```json
    {
        "flagEnabled": true
    }
    ```
- **Respuesta Exitosa:** `200 OK`
- **Respuesta Errónea:** 
    - `400 Bad Request` si hay un error al actualizar el flag.
    - `403 Forbidden` si el usuario no tiene permisos de administrador.
    - `404 Not Found` si el usuario no existe.
