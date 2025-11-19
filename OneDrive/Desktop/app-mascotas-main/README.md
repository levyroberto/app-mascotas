# API Mascotas

Backend para gestión de usuarios y mascotas, con autenticación por JWT, persistencia en MongoDB y validación de tipos/razas de mascotas mediante una API externa (MockAPI).

---

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/levyroberto/app-mascotas.git
cd app-mascotas
```

### Instalar dependencias

```bash
npm install
```

### Configuración

Crear el archivo `.env` en el root del proyecto:

```
MODO_PERSISTENCIA=mongo
MONGO_URL={COMPLETAR}
PORT={COMPLETAR}
MOCKAPI_BASE_URL={COMPLETAR}
JWT_SECRET={COMPLETAR}
```

> **Nota:** `JWT_SECRET` puede cambiarse por una clave más segura si se desea usar en otro entorno.

---

## Ejecución

### Modo desarrollo (con nodemon)

```bash
npm run dev
```

### Modo normal

```bash
npm start
```

El servidor se levanta por defecto en:

```
http://localhost:3000
```

---

## Probar la API con Postman

1. Levantar el servidor (`npm run dev` o `npm start`).
2. Abrir Postman y crear una colección.
3. Configurar las requests según los endpoints detallados más abajo.
4. Para los endpoints protegidos, agregar en los headers:

```
Authorization: Bearer {TOKEN}
```

donde `{TOKEN}` es el token devuelto por el login.

---

## Entidades

### Usuario

- `_id`
- `nombreCompleto`
- `direccion`
- `email` 
- `password` 
- `mascotas` 

### Mascota

- `_id`
- `nombre`
- `tipo` 
- `raza` 
- `edad`
- `foto`
- `cantidadVacunas`
- `usuarioId` 

---

## Endpoints

### Auth / Autenticación (`/api/auth`)

#### POST `/login` - Login request

Verifica email y password.

Si las credenciales son correctas, devuelve un token JWT con expiración de 30 minutos.

**Body de ejemplo:**

```json
{
  "email": "correo@ejemplo.com",
  "password": "clave123"
}
```

**Respuesta de ejemplo:**

```json
{
  "message": "Login exitoso",
  "token": "{JWT}"
}
```

Este token se usa en los demás endpoints protegidos vía header:

```
Authorization: Bearer {JWT}
```

---

### Usuarios (`/api/usuarios`)

#### POST `/` - Crear usuario

No requiere autenticación.

Crea un nuevo usuario.

**Body de ejemplo:**

```json
{
  "nombreCompleto": "Juan Pérez",
  "direccion": "Calle Falsa 123",
  "email": "juan@example.com",
  "password": "clave123"
}
```

#### GET `/` - Obtener todos los usuarios

Requiere autenticación (token en el header).

Devuelve el listado completo de usuarios.

#### GET `/:id` - Obtener usuario por id

Requiere autenticación.

Devuelve el usuario con el `_id` indicado.

#### PUT `/:id` - Actualizar usuario

Requiere autenticación.

Actualiza los datos del usuario con el `_id` indicado.

**Body de ejemplo (campos a modificar):**

```json
{
  "nombreCompleto": "Juan Actualizado",
  "direccion": "Otra dirección 456"
}
```

#### DELETE `/:id` - Eliminar usuario

Requiere autenticación.

Elimina el usuario y todas sus mascotas asociadas.

#### GET `/:id/mascotas` - Obtener mascotas de un usuario

Requiere autenticación.

Devuelve la información del usuario y la lista de sus mascotas.

**Respuesta de ejemplo:**

```json
{
  "usuario": {
    "id": "ID_USUARIO",
    "nombreCompleto": "Juan Pérez",
    "email": "juan@example.com"
  },
  "mascotas": [
    {
      "_id": "ID_MASCOTA",
      "nombre": "Firulais",
      "tipo": "perro",
      "edad": 3,
      "usuarioId": "ID_USUARIO"
    }
  ]
}
```

---

### Mascotas (`/api/mascotas`)

Todos los endpoints de mascotas requieren autenticación (token en el header).

#### GET `/` - Obtener todas las mascotas

Devuelve todas las mascotas registradas, incluyendo datos básicos del usuario dueño (nombre y email).

#### GET `/:id` - Obtener mascota por id

Devuelve la mascota con el `_id` indicado.

#### GET `/usuario/:usuarioId` - Obtener mascotas por usuario

Devuelve todas las mascotas asociadas al `usuarioId` indicado.

#### GET `/listar-por-tipo-y-edad` - Listar por tipo y edad

Devuelve las mascotas agrupadas por tipo, con:

- Edad promedio por tipo (`edadPromedio`).
- Mascotas de cada tipo ordenadas de mayor a menor edad.

**Respuesta de ejemplo:**

```json
[
  {
    "tipo": "perro",
    "edadPromedio": 4.5,
    "mascotas": [
      {
        "id": "ID_MASCOTA",
        "nombre": "Lola",
        "edad": 6,
        "usuarioId": "ID_USUARIO"
      }
    ]
  }
]
```

#### POST `/` - Crear mascota

Crea una nueva mascota asociada a un usuario.

**Body de ejemplo:**

```json
{
  "nombre": "Firulais",
  "tipo": "perro",
  "raza": "labrador",
  "edad": 3,
  "cantidadVacunas": 4,
  "usuarioId": "ID_USUARIO",
  "foto": "https://mi-cdn.com/fotos/firulais.png"
}
```

**Validaciones importantes:**

- `tipo` y `raza` son obligatorios.
- Se consulta la API externa (`MOCKAPI_BASE_URL`) para:
  - Buscar el tipo de animal por nombre (`/animals`).
  - Obtener las razas de ese tipo (`/raza`).
  - Validar que la raza enviada exista para ese tipo.
- Si la raza no corresponde al tipo, se devuelve estado 400.
- Si la creación es exitosa:
  - Se guarda la mascota en la colección de mascotas.
  - Se agrega el id de la mascota al array `mascotas` del usuario correspondiente.

#### PUT `/:id` - Actualizar mascota

Actualiza los datos de la mascota con el `_id` indicado.

**Body de ejemplo:**

```json
{
  "nombre": "Firulais Actualizado",
  "edad": 4,
  "cantidadVacunas": 5
}
```

#### DELETE `/:id` - Eliminar mascota

Elimina la mascota con el `_id` indicado y la remueve también del array `mascotas` del usuario dueño.

---
