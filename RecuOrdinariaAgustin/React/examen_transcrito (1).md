# Examen — Módulo: Desarrollo Web Entorno Cliente
**Centro:** IES Francisco de Goya

---

## Ejercicio 1 — [1,5 puntos]

Implementa validación de contraseña en el formulario de autenticación con dos tipos distintos:

### Validación durante el registro (creación de cuenta):
- Mínimo 12 caracteres
- Al menos dos letras mayúscula
- Al menos dos números
- Al menos un carácter especial: `{ , - , ? , + , }`

### Validación durante el inicio de sesión:
- Mínimo 8 caracteres
- La validación de formato (mayúsculas, números, caracteres especiales) **no** se aplica

### Requisitos:
Todos los mensajes de error deben mostrarse agrupados en un solo texto.

> Ejemplo: *"La contraseña debe tener 12 caracteres y 2 letras mayúscula"*

---

## Ejercicio 2 — [2 puntos]

Modificar el componente `AuthContext` para implementar un sistema de notificaciones mejorado que:

Al iniciar/abandonar sesión, mostrar un mensaje personalizado con **SweetAlert2** incluyendo la fecha actual.

> Ejemplo: *"Hola/Adiós, bienvenido de nuevo, hoy 26 de Mayo"*

Además de mostrar el mismo mensaje, utilizar una notificación tipo **"toast"** usando **React Toastify**:
[https://www.npmjs.com/package/react-toastify](https://www.npmjs.com/package/react-toastify)

---

## Ejercicio 3 — [3,5 puntos]

Actualmente, la aplicación no registra cuándo fue la última vez que un usuario inició sesión, lo cual es necesario para estadísticas y para proporcionar una experiencia más personalizada.

Implementar un sistema que registre automáticamente la fecha y hora del último acceso cada vez que el administrador inicia sesión exitosamente.

### 1. Cada vez que un usuario inicie sesión correctamente:
- Capturar la fecha y hora actual en el momento del login
- Formatear la información como: `DD/MM/AAAA HH:MM:SS`
- Guardar esta información de manera persistente

### 2. Lugares de Almacenamiento
Debes guardar la información del último acceso utilizando **localStorage**, usando la clave: `"administrador"`

Los datos deben sobrevivir al cierre del navegador.

### 3. Recuperación y Visualización
- Al iniciar la aplicación: verificar si hay información del último acceso almacenada.
- En la notificación de bienvenida: mostrar el último acceso si existe.

> Ejemplo si hay registro previo: *"¡Hola! Tu último acceso fue: 15/02/2024 14:30:22"*

> Ejemplo si es el primer acceso: *"¡Hola! Es tu primer acceso."*

---

## Ejercicio 4 — [3 puntos]

En la página de **"Administración"**, implementar la funcionalidad asociada a insertar un nuevo elemento:

- **Añadir un elemento.** En el formulario a utilizar, todos los campos son obligatorios.

---

## INFORMACIÓN SOBRE LA ENTREGA

Para realizar la **entrega** debes:

1. Borrar la carpeta `node_modules`
2. Comprimir el proyecto entero y renombrarlo con tu nombre. Por ejemplo:
   > `"Agustin-Aguilera-Ordinaria-React.zip"`
3. Subirlo al aula virtual, en la tarea correspondiente en el apartado **"Exámenes"**
