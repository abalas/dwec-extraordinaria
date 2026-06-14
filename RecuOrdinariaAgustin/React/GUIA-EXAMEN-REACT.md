# Guía paso a paso — Examen de React (Desarrollo Web Entorno Cliente)

Esta guía está pensada para alguien que **nunca ha hecho un examen así**. Vamos despacio: cada comando, cada línea que escribimos, en qué archivo va y **por qué**. Si sigues los pasos en orden, llegas al examen entregable.

El proyecto es una tienda de supermercado ("carro de compra") hecha con **React + Vite**, que usa **Supabase** para el login. El examen tiene 4 ejercicios:

| Ej. | Puntos | Qué pide | Archivos que tocaremos |
|-----|--------|----------|------------------------|
| 1 | 1,5 | Validar la contraseña (registro vs. login) | `src/Paginas/Login.jsx` |
| 2 | 2 | Avisos al entrar/salir con SweetAlert2 + Toastify | `src/context/AuthContext.jsx`, `src/App.jsx` |
| 3 | 3,5 | Guardar el último acceso en `localStorage` | `src/context/AuthContext.jsx` |
| 4 | 3 | Formulario para añadir un producto | `src/componentes/Administracion.jsx` + nuevo componente |

---

## Parte 0 — Preparar el entorno

### 0.1 Descomprimir y abrir el proyecto

Descomprime el `.zip` que te dio el profesor. Verás una carpeta llamada `2-Carro-compra`. Ábrela con **Visual Studio Code** (`Archivo → Abrir carpeta`).

Abre una terminal dentro de VS Code (`Terminal → Nueva terminal`) y entra en la carpeta del proyecto:

```bash
cd 2-Carro-compra
```

### 0.2 Instalar las dependencias

El proyecto **no trae** la carpeta `node_modules` (son las librerías; se instalan en cada ordenador). Para crearla:

```bash
npm install
```

> **¿Qué hace?** Lee el archivo `package.json`, descarga todas las librerías que el proyecto necesita (React, Vite, axios, Supabase, SweetAlert2…) y las guarda en `node_modules`. Tarda unos segundos.

### 0.3 Instalar React Toastify (lo pide el Ejercicio 2)

```bash
npm install react-toastify
```

> **¿Qué hace?** Descarga la librería de notificaciones tipo "toast" y la **añade automáticamente** a `package.json`. Es la única librería nueva que el examen nos obliga a instalar.

### 0.4 Arrancar el proyecto

```bash
npm run dev
```

Vite te dará una dirección, normalmente `http://localhost:5173/`. Ábrela en el navegador. Deja este comando corriendo: cada vez que guardes un archivo, la web se recarga sola. Para parar el servidor: `Ctrl + C`.

> **Nota sobre el login (importante para probar):** el botón "Iniciar Sesión" usa Supabase. Solo entrará si usas un usuario que exista en el Supabase del profesor (o uno que crees tú con "Regístrate"). Las notificaciones de los ejercicios 2 y 3 **solo aparecen cuando el login es correcto**.

---

## Parte 1 — Entender dónde está cada cosa

Antes de tocar nada, conviene saber el mapa. Los archivos que nos importan:

```
src/
├── App.jsx                         ← monta toda la app y las rutas
├── Paginas/
│   └── Login.jsx                   ← formulario de email/contraseña  (Ej.1)
├── context/
│   └── AuthContext.jsx             ← lógica de iniciar/cerrar sesión  (Ej.2 y 3)
├── servicios/
│   └── storage/
│       └── storage.js              ← helper para leer/escribir localStorage  (lo usa Ej.3)
└── componentes/
    ├── Administracion.jsx          ← página de administración  (Ej.4)
    └── crud-productos/
        ├── ProductoConsultar.jsx
        ├── ProductoBorrar.js
        └── ProductoCrear.jsx       ← lo CREAREMOS nosotros  (Ej.4)
```

Dos piezas clave que ya existen y vamos a reutilizar:

- **`AuthContext.jsx`** es el "cerebro" de la sesión. Tiene las funciones `signIn` (entrar), `signUp` (registrarse) y `signOut` (salir). Como está en un *Context*, cualquier componente puede usarlas con `useAuth()`.
- **`storage.js`** ya trae una clase `LocalStorageServicio` con métodos `get(clave)` y `set(clave, valor)` que leen/escriben en `localStorage` haciendo el `JSON.parse` / `JSON.stringify` por nosotros. **No reinventamos la rueda**: en el Ejercicio 3 la usamos.

---

## Ejercicio 1 — Validación de contraseña [1,5 pts]

**Qué pide:**

- Al **registrarse**: mínimo 12 caracteres, al menos 2 mayúsculas, al menos 2 números y al menos 1 carácter especial de `{ } - ? +`.
- Al **iniciar sesión**: solo mínimo 8 caracteres (sin comprobar el formato).
- Todos los errores juntos en **un único texto**, por ejemplo: *"La contraseña debe tener 12 caracteres y 2 letras mayúscula"*.

**Archivo:** `src/Paginas/Login.jsx`

### 1.1 El problema de partida

Si abres `Login.jsx` verás que la función de validación no hace nada útil:

```jsx
const validar = () => {
  alert("Cuidado...no tengo validación")
  return true;
};
```

Además hay un **fallo escondido**: más abajo, en `handleSubmit`, el código usa `setErrores(...)` pero esa variable **no existe todavía**. La vamos a crear, lo que de paso arregla el fallo.

### 1.2 Crear el estado donde guardar los errores

Busca donde se declaran los `useState` (arriba del componente) y añade una línea para `errores`:

```jsx
const [isSignUp, setIsSignUp] = useState(false);
const [loading, setLoading] = useState(false);
const [errores, setErrores] = useState({}); // Ej.1: guardamos aquí los mensajes de error
const { signIn, signUp } = useAuth();
```

> **¿Por qué un objeto `{}`?** Así podemos tener varios errores con nombre: `errores.password` (los de la contraseña) y `errores.submit` (los que devuelve Supabase). Empezamos con el objeto vacío = "no hay errores".

### 1.3 Escribir la validación de verdad

Sustituye la función `validar` entera por esta:

```jsx
const validar = () => {

  const fallos = []; // ej.1: aquí acumulamos cada requisito incumplido
  const { password } = form;

  if (isSignUp) {
    // ---- Validación de REGISTRO (crear cuenta) ----
    if (password.length < 12) {
      fallos.push("12 caracteres");
    }

    const mayusculas = password.match(/[A-Z]/g) || [];
    if (mayusculas.length < 2) {
      fallos.push("2 letras mayúscula");
    }

    const numeros = password.match(/[0-9]/g) || [];
    if (numeros.length < 2) {
      fallos.push("2 números");
    }

    const tieneEspecial = /[{}\-?+]/.test(password);
    if (!tieneEspecial) {
      fallos.push("1 carácter especial ( { } - ? + )");
    }
  } else {
    // ---- Validación de INICIO DE SESIÓN ----
    if (password.length < 8) {
      fallos.push("8 caracteres");
    }
  }

  if (fallos.length > 0) {
    // Todos los mensajes agrupados en un único texto
    setErrores({ password: "La contraseña debe tener " + fallos.join(" y ") });
    return false;
  }

  setErrores({}); // sin errores: limpiamos
  return true;

};
```

**Explicación línea a línea de lo importante:**

- `const fallos = []` → una lista vacía. Por cada regla que NO se cumple, metemos un trocito de texto. Al final los unimos. Así conseguimos el "único texto agrupado" que pide el enunciado.
- `if (isSignUp)` → la variable `isSignUp` ya existe en el componente y vale `true` cuando el usuario está en modo "Registrarse" y `false` cuando está en "Iniciar Sesión". Es la forma de aplicar **dos validaciones distintas** según el caso.
- `password.length < 12` → cuenta los caracteres.
- `password.match(/[A-Z]/g)` → busca **todas** las mayúsculas (la `g` = global). Devuelve un array con cada coincidencia, o `null` si no hay ninguna; por eso ponemos `|| []` (si es `null`, usamos un array vacío) y luego miramos `.length` para exigir **dos**.
- `password.match(/[0-9]/g)` → lo mismo pero con dígitos.
- `/[{}\-?+]/.test(password)` → `.test()` devuelve `true`/`false`. El `[...]` es un "conjunto de caracteres permitidos": vale con que aparezca **uno** de `{ } - ? +`. El `\-` lleva una barra porque dentro de los corchetes el guion tiene un significado especial (rango), y así lo tratamos como un guion normal.
- `fallos.join(" y ")` → une la lista con la palabra " y " en medio. Si fallan dos reglas sale: *"...12 caracteres y 2 letras mayúscula"*. ✅ Justo el formato del ejemplo.
- `return false` corta el envío del formulario; `return true` lo deja continuar.

> **Aclaración sobre los caracteres especiales:** el enunciado los escribe como `{ , - , ? , + , }`. Lo más lógico es que las comas sean separadores y el conjunto real sea `{ } - ? +`. Si tu profesor quiere que la coma **también** cuente, basta con añadirla dentro de los corchetes: `/[{}\-?+,]/`.

### 1.4 Mostrar el error en pantalla

La validación ya guarda el texto, pero hay que **enseñarlo**. Busca el cierre del campo de la contraseña (`</div>` justo después del `input` de password) y añade debajo:

```jsx
          </div>

          {/* Ej.1: mensaje de error agrupado de la contraseña */}
          {errores.password && (
            <p className="error-message">{errores.password}</p>
          )}

          {/* Error devuelto por Supabase (credenciales incorrectas, etc.) */}
          {errores.submit && (
            <p className="error-message">{errores.submit}</p>
          )}
```

> **¿Qué es `{errores.password && (...)}`?** En React es la forma corta de decir "si `errores.password` tiene contenido, pinta el `<p>`; si está vacío, no pintes nada". La clase `error-message` ya existe en `login.css`, así que se ve en rojo sin tocar estilos.

**Cómo probarlo:** ve a `/login`, pulsa "¿No tienes cuenta? Regístrate" y escribe una contraseña floja (ej. `abc`). Al darle al botón verás el mensaje agrupado. Cambia a modo login y comprueba que solo exige 8 caracteres.

---

## Ejercicio 2 — Notificaciones al entrar/salir [2 pts]

**Qué pide:** al iniciar o cerrar sesión, mostrar un mensaje personalizado con **SweetAlert2** que incluya la fecha de hoy (*"Hola/Adiós, bienvenido de nuevo, hoy 26 de Mayo"*) y, además, el **mismo aviso** como notificación **toast** con **React Toastify**.

**Archivos:** `src/context/AuthContext.jsx` (la lógica) y `src/App.jsx` (montar el contenedor de toasts).

### 2.1 Preparar las "importaciones" en AuthContext

Arriba del todo de `AuthContext.jsx`, junto a los imports que ya hay, añadimos los que necesitamos. SweetAlert2 ya estaba instalado; `toast` viene de la librería que instalamos en el paso 0.3; y `LocalStorageServicio` lo usaremos en el Ejercicio 3:

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Swal from 'sweetalert2'                              // Ej.2: ventanas emergentes
import { toast } from 'react-toastify'                      // Ej.2: notificaciones toast
import LocalStorageServicio from '../servicios/storage/storage.js' // Ej.3: persistencia
```

### 2.2 Una función para formatear la fecha en español

SweetAlert pide la fecha como *"26 de Mayo"*. JavaScript no la da así de fácil con el mes en español y con mayúscula, así que hacemos una pequeña función **fuera del componente** (justo debajo de los imports):

```jsx
// ---- Ej.2: fecha en formato largo en español -> "26 de Mayo" ----
const formatearFechaLarga = (fecha) => {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]}`
}
```

> **¿Por qué un array de meses?** `fecha.getMonth()` devuelve un número del 0 al 11 (enero = 0). Con ese número sacamos el nombre del mes del array. `getDate()` da el día del mes. El resultado: `"26 de Mayo"`.

### 2.3 Avisar al INICIAR sesión

Busca la función `signIn` dentro del componente `AuthProvider`. La modificamos para que, **si el login fue correcto** (`!error`), muestre el SweetAlert y el toast.

> Nota: aquí dejamos preparado también el Ejercicio 3 (lo de `ultimoAcceso` y `LocalStorageServicio`), porque ambos ejercicios comparten el mismo mensaje de bienvenida. Lo explicamos a fondo en el Ejercicio 3.

```jsx
// Función para iniciar sesión con email y contraseña
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Solo notificamos si el login ha sido correcto
  if (!error) {
    // Ej.3: recuperamos el ÚLTIMO acceso ANTES de sobreescribirlo
    const ultimoAcceso = LocalStorageServicio.get("administrador")

    // Ej.3: construimos la línea del último acceso
    let mensajeAcceso
    if (ultimoAcceso) {
      mensajeAcceso = `¡Hola! Tu último acceso fue: ${ultimoAcceso}`
    } else {
      mensajeAcceso = "¡Hola! Es tu primer acceso."
    }

    // Ej.2: fecha de hoy en formato largo
    const hoy = formatearFechaLarga(new Date())

    // Ej.2: ventana SweetAlert2 con saludo + fecha + último acceso (Ej.3)
    Swal.fire({
      title: "Hola, bienvenido de nuevo",
      text: `Hoy ${hoy}. ${mensajeAcceso}`,
      icon: "success",
    })

    // Ej.2: además, notificación tipo toast
    toast.success(`Hola, bienvenido de nuevo, hoy ${hoy}`)

    // Ej.3: guardamos AHORA el nuevo timestamp para la próxima vez
    const fechaCompleta = formatearFechaCompleta(new Date())
    LocalStorageServicio.set("administrador", fechaCompleta)
  }

  return { data, error } // Retornar datos y posible error para manejo en el componente
}
```

### 2.4 Avisar al CERRAR sesión

Ahora la función `signOut`. Mostramos la despedida **antes** de cerrar la sesión:

```jsx
// Función para cerrar sesión
const signOut = async () => {

  // Ej.2: mensaje de despedida con la fecha actual
  const hoy = formatearFechaLarga(new Date())

  Swal.fire({
    title: "Adiós",
    text: `Adiós, hasta pronto, hoy ${hoy}`,
    icon: "info",
  })

  toast.info(`Adiós, hasta pronto, hoy ${hoy}`)

  await supabase.auth.signOut()

  return true
}
```

> **¿Por qué meter esto en `AuthContext` y no en el botón?** El enunciado dice literalmente "Modificar el componente `AuthContext`". Además, así el aviso sale **siempre** que se entra o se sale, sin importar desde qué botón. Y al ponerlo dentro de `signIn`/`signOut` (y no en el `onAuthStateChange`) evitamos que el mensaje se repita al recargar la página.

### 2.5 Montar el contenedor de toasts en App.jsx

Los toasts necesitan un sitio donde dibujarse: el componente `<ToastContainer />`. Y hay que importar su CSS o saldrían sin estilo. Abre `src/App.jsx`.

Añade los imports (junto a los demás de arriba):

```jsx
import UseStorageState from './servicios/storage/UseStorageState'
import { ToastContainer } from 'react-toastify'      // Ej.2
import 'react-toastify/dist/ReactToastify.css'        // Ej.2: estilos de los toasts
```

Y coloca el contenedor dentro del `<AuthProvider>`, al principio del `<div className="App">`:

```jsx
    <AuthProvider>
      <div className="App">
        {/* Ej.2: contenedor donde se dibujan las notificaciones toast */}
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="App-header">
```

> `position="top-right"` = arriba a la derecha. `autoClose={3000}` = se cierra solo a los 3 segundos. El `<ToastContainer />` se pone **una sola vez** en toda la app; luego, desde cualquier sitio, `toast.success(...)` hace que aparezca ahí.

**Cómo probarlo:** inicia sesión correctamente → debe salir la ventana de SweetAlert con la fecha **y** un toast arriba a la derecha. Pulsa "Cerrar Sesión" → el mensaje de despedida.

---

## Ejercicio 3 — Registrar el último acceso [3,5 pts]

**Qué pide:**

1. Cada login correcto: capturar fecha y hora, formatear como `DD/MM/AAAA HH:MM:SS` y **guardarlo de forma persistente**.
2. Guardarlo en **`localStorage`** con la clave `"administrador"` (debe sobrevivir a cerrar el navegador).
3. Al entrar, mostrar el último acceso en el saludo. Si no hay ninguno: *"¡Hola! Es tu primer acceso."*

**Archivo:** `src/context/AuthContext.jsx`

> Buena noticia: en el Ejercicio 2 ya dejamos casi todo escrito dentro de `signIn`. Aquí solo **entendemos** esa parte y **añadimos la función que formatea la fecha completa**.

### 3.1 La función que da el formato `DD/MM/AAAA HH:MM:SS`

Debajo de `formatearFechaLarga` (fuera del componente) añade:

```jsx
// ---- Ej.3: fecha completa -> "DD/MM/AAAA HH:MM:SS" ----
const formatearFechaCompleta = (fecha) => {
  const dd = String(fecha.getDate()).padStart(2, "0")
  const mm = String(fecha.getMonth() + 1).padStart(2, "0")
  const yyyy = fecha.getFullYear()
  const hh = String(fecha.getHours()).padStart(2, "0")
  const min = String(fecha.getMinutes()).padStart(2, "0")
  const ss = String(fecha.getSeconds()).padStart(2, "0")
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`
}
```

**Por qué cada cosa:**

- `getMonth() + 1` → el mes empieza en 0, así que enero (0) debe verse como `01`; sumamos 1.
- `padStart(2, "0")` → rellena con un cero a la izquierda si hace falta. El día `5` pasa a `"05"`. Por eso convertimos antes a texto con `String(...)`.
- El resultado: por ejemplo `"15/02/2024 14:30:22"`. ✅ Igual que el ejemplo del enunciado.

### 3.2 Cómo encaja con el `signIn` que ya escribimos

Mira otra vez el bloque dentro de `if (!error)` del Ejercicio 2. El **orden importa muchísimo**:

1. **Primero leemos** lo que había guardado: `const ultimoAcceso = LocalStorageServicio.get("administrador")`. Esto es el acceso *anterior* (o `null` si es la primera vez).
2. **Construimos el mensaje** con ese valor: si existe → *"¡Hola! Tu último acceso fue: ..."*; si no → *"¡Hola! Es tu primer acceso."*.
3. **Mostramos** el SweetAlert/toast (ya con el dato correcto).
4. **Al final, guardamos** la fecha de AHORA: `LocalStorageServicio.set("administrador", fechaCompleta)`.

> ⚠️ Si guardáramos **antes** de leer, siempre veríamos la hora actual en vez del acceso anterior. Por eso leer va primero y guardar va el último.

`LocalStorageServicio` es la clase de `storage.js`: su método `.set` ya hace `JSON.stringify` y `.get` ya hace `JSON.parse`, así que no nos preocupamos de convertir. Y como usa `window.localStorage`, **el dato sobrevive aunque cierres el navegador**, que es justo lo que pide el punto 2.

**Cómo probarlo:**
1. Inicia sesión por primera vez → verás *"¡Hola! Es tu primer acceso."*.
2. Cierra sesión y vuelve a entrar → ahora verás *"¡Hola! Tu último acceso fue: 02/06/2026 17:45:10"* (con tu fecha/hora reales).
3. Abre las DevTools del navegador (`F12`) → pestaña **Application → Local Storage** → verás la clave `administrador` con el valor guardado.

---

## Ejercicio 4 — Añadir un producto [3 pts]

**Qué pide:** en la página de **Administración**, implementar el "Añadir un elemento". En el formulario, **todos los campos son obligatorios**.

**Archivos:** creamos `src/componentes/crud-productos/ProductoCrear.jsx` y modificamos `src/componentes/Administracion.jsx`.

### 4.1 Cómo funciona la página de Administración

`Administracion.jsx` guarda la lista de productos en un estado (`productos`) y ya tiene un sistema de **modales** (ventanas emergentes) con el componente `Modal`. Cuando pulsas "Consulta" abre un modal con los datos. Vamos a copiar esa misma idea para "Añadir": un botón que abre un modal con un formulario.

### 4.2 Crear el componente del formulario

Crea un archivo nuevo: `src/componentes/crud-productos/ProductoCrear.jsx` con este contenido:

```jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Ej.4: formulario para AÑADIR un producto nuevo.
// Recibe onCrear: una función del padre (Administracion) a la que le
// entregamos el producto ya validado.
const ProductoCrear = ({ onCrear }) => {

  // Estado del formulario: un objeto con los tres campos
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    url: "",
  });

  // Cada vez que el usuario escribe, actualizamos el campo correspondiente
  const gestionarCambio = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ej.4: TODOS los campos son obligatorios
    if (form.nombre.trim() === "" || form.precio.trim() === "" || form.url.trim() === "") {
      Swal.fire({
        title: "Faltan datos",
        text: "Todos los campos son obligatorios",
        icon: "warning",
      });
      return;
    }

    // Avisamos al padre con el producto listo (precio como número)
    onCrear({
      nombre: form.nombre,
      precio: Number(form.precio),
      url: form.url,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-crear">
      <h3>Añadir producto</h3>

      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={gestionarCambio}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          value={form.precio}
          onChange={gestionarCambio}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL de la imagen</label>
        <input
          id="url"
          name="url"
          value={form.url}
          onChange={gestionarCambio}
          required
          placeholder="./imagenes/manzana.jpg"
        />
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default ProductoCrear;
```

**Lo importante:**

- `useState` con un objeto `{ nombre, precio, url }` → un único estado para los tres campos.
- `gestionarCambio` usa `[name]: value`: como cada `<input>` tiene su `name`, esta misma función sirve para los tres campos. Es el patrón típico de formularios controlados en React (idéntico al que ya usa el Login).
- La obligatoriedad la comprobamos **en JavaScript** con `.trim() === ""` (el `.trim()` quita espacios para que "   " no cuele como válido). Si algo está vacío → SweetAlert de aviso y `return` (no continúa). Además ponemos `required` en los `<input>` como segunda barrera.
- No metemos el producto en la lista desde aquí: llamamos a `onCrear(...)`, una función que nos pasa el componente padre. Así el formulario no necesita saber **cómo** se guarda; solo entrega los datos. Es más limpio y reutilizable.

### 4.3 Conectar el formulario en Administracion.jsx

Abre `src/componentes/Administracion.jsx` y haz **cuatro** cambios pequeños.

**(a) Imports.** Arriba, descomenta `Swal` (estaba comentado y eso podía dar error) e importa el nuevo componente:

```jsx
import { useEffect, useState } from "react";
import servicioProductos from "../servicios/axios/servicioProductos";
import Swal from "sweetalert2";
import ProductoConsultar from "./crud-productos/ProductoConsultar";
import ProductoBorrar from "./crud-productos/ProductoBorrar";
import ProductoCrear from "./crud-productos/ProductoCrear"; // Ej.4
import Modal from "./Modal";
import '../estilos/Administracion.css';
```

**(b) Añadir el modal "crear" al estado de modales.** Busca el `useState` de `modals` y añade la clave `crear`:

```jsx
const [modals, setModals] = useState({
  consultar: false,
  crear: false, // Ej.4
});
```

**(c) La función que añade el producto.** Cerca de las otras funciones (`consultarProducto`, `borrarProducto`, `EditarProducto`) añade:

```jsx
// Ej.4: añadir un producto nuevo a la lista
const crearProducto = (producto) => {
  // Generamos un id nuevo a partir del id más alto existente
  const nuevoId =
    productos.length > 0
      ? String(Math.max(...productos.map((p) => Number(p.id))) + 1)
      : "1";

  const productoConId = { id: nuevoId, ...producto };

  // Lo añadimos al estado (la lista se redibuja sola)
  setProductos([...productos, productoConId]);

  // Cerramos el modal y avisamos
  gestionarModal("crear", false);
  Swal.fire({
    title: "Creado",
    text: "Producto añadido correctamente",
    icon: "success",
  });
};
```

> **¿Qué hace el `nuevoId`?** Recorre los productos, coge el `id` más alto (`Math.max`) y le suma 1, para que el nuevo no repita id. Si la lista está vacía, empieza en `"1"`.
> **`setProductos([...productos, productoConId])`** crea una lista nueva con todos los de antes **más** el nuevo. En React no se modifica el array viejo: se crea uno nuevo y se asigna. Al cambiar el estado, la tabla se vuelve a pintar sola con el producto añadido.

**(d) El botón y el modal en la pantalla.** En el `return`, justo después de `<>`, añade el botón:

```jsx
return (
  <>
    {/* Ej.4: botón para abrir el formulario de alta */}
    <button onClick={() => gestionarModal("crear", true)}>
      Añadir producto
    </button>

    <ul className="aficiones-list">
```

Y junto al modal de "consultar" que ya existe, añade el de "crear":

```jsx
    <Modal isOpen={modals.consultar} onClose={() => gestionarModal("consultar", false)}>
      <ProductoConsultar producto={productoSeleccionado} />
    </Modal>

    {/* Ej.4: modal con el formulario de alta */}
    <Modal isOpen={modals.crear} onClose={() => gestionarModal("crear", false)}>
      <ProductoCrear onCrear={crearProducto} />
    </Modal>

  </>
);
```

> El `onCrear={crearProducto}` es la pieza que une todo: cuando el formulario hijo llama a `onCrear(...)`, en realidad ejecuta `crearProducto(...)` del padre, que mete el producto en la lista.

**Cómo probarlo:** entra en la web (tienes que estar logueado para que aparezca el enlace "Administracion" en el menú), ve a esa página, pulsa **"Añadir producto"**, rellena los campos y dale a Guardar. Si dejas alguno vacío, sale el aviso. Si los rellenas, el producto aparece en la lista.

> **Nota técnica honesta:** la lista de Administración intenta cargar productos de un servidor (`localhost:3000`) que probablemente **no esté arrancado** en el examen, así que es normal que empiece vacía ("No se encontraron productos."). No pasa nada: nuestra función "Añadir" trabaja sobre el estado local de React, así que **funciona igual** aunque no haya servidor, y el producto nuevo se ve al instante. Eso es exactamente lo que pide el ejercicio.

---

## Parte final — Comprobar y entregar

### Comprobación rápida (recomendado)

Antes de entregar, asegúrate de que el proyecto **compila sin errores**:

```bash
npm run build
```

Si termina con algo parecido a `✓ built in ...` y sin errores en rojo, vas bien. (Puede salir un aviso amarillo de "chunks larger than 500 kB"; es solo una recomendación, **no es un error** y no afecta a la nota.)

### Entrega (tal como pide el examen)

1. **Borra la carpeta `node_modules`.** Pesa muchísimo y no debe entregarse. Desde la terminal, dentro de `2-Carro-compra`:

   ```bash
   # En Windows (PowerShell):
   rmdir /s /q node_modules
   # En Mac/Linux:
   rm -rf node_modules
   ```

   (O simplemente bórrala a mano desde el explorador de archivos.)

2. **Comprime el proyecto entero** y renómbralo con tu nombre, siguiendo el ejemplo del enunciado:

   ```
   Tu-Nombre-Ordinaria-React.zip
   ```

3. **Súbelo al aula virtual**, en la tarea correspondiente del apartado **"Exámenes"**.

> Consejo: comprime la carpeta **completa** del proyecto (la que contiene `package.json`, `src`, `public`, etc.), no solo el `src`. Al corregir, el profesor hará `npm install` para recrear `node_modules`.

---

## Resumen de todo lo que tocaste

| Archivo | Qué hiciste | Ejercicio |
|---------|-------------|-----------|
| `src/Paginas/Login.jsx` | Estado `errores`, función `validar` con dos modos, mostrar el error | 1 |
| `src/context/AuthContext.jsx` | Imports, funciones de fecha, avisos en `signIn`/`signOut`, último acceso | 2 y 3 |
| `src/App.jsx` | `<ToastContainer />` + import del CSS de Toastify | 2 |
| `src/componentes/crud-productos/ProductoCrear.jsx` | Componente nuevo del formulario | 4 |
| `src/componentes/Administracion.jsx` | Import de Swal y ProductoCrear, modal `crear`, botón y `crearProducto` | 4 |
| `package.json` | Se añadió `react-toastify` (con `npm install react-toastify`) | 2 |

¡Y ya está! Si entiendes el *por qué* de cada paso (no solo el *qué*), podrás repetir este tipo de ejercicios aunque cambien los detalles.
