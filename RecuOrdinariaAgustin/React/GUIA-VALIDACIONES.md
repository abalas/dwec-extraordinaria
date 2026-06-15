# Guía del sistema de validación de formularios

Módulo: `src/Toolkit/validaciones.js`

La idea central: **nunca tocas la lógica del validador**. Solo cambias un **objeto de reglas** (configuración). Cambiando ese objeto, cambian todas las validaciones.

---

## 1. Las 3 piezas del módulo

| Pieza | Qué es | Para qué sirve |
|---|---|---|
| `validarCampo(valor, regla)` | Valida **un** campo | Devuelve un `string` con el error (todos los fallos juntos) o `null` si está bien |
| `validarFormulario(datos, reglas)` | Valida **todo** el formulario | Devuelve `{ valido: boolean, errores: { campo: mensaje } }` |
| `REGLAS_JUEGO` (y las que crees tú) | El **objeto de configuración** | Aquí defines las reglas de cada campo. **Esto es lo único que tocas** |

---

## 2. Opciones que admite una regla

Cada campo se describe con un objeto. Estas son **todas** las opciones disponibles:

| Opción | Tipo | Qué hace |
|---|---|---|
| `etiqueta` | `string` | Nombre legible del campo para el mensaje (ej. `"La contraseña"`) |
| `obligatorio` | `boolean` | Si es `true`, no puede estar vacío |
| `longitudMin` | `number` | Mínimo de caracteres |
| `longitudMax` | `number` | Máximo de caracteres |
| `caracteresObligatorios` | `array` | Lista de caracteres **concretos** que DEBEN aparecer (ej. `["-", "_"]`) |
| `caracteresProhibidos` | `array` | Lista de caracteres que NO pueden aparecer (ej. `["?", "!"]`) |
| `regex` | `RegExp` | Una expresión regular que el valor debe cumplir |
| `mensajeRegex` | `string` | El texto que se muestra si falla el `regex` |

> ⚠️ **Solo hay UN `regex` por campo.** Si necesitas varias condiciones de tipo "al menos una X" (mayúscula + minúscula, por ejemplo), se combinan en un solo `regex` con *lookaheads* (lo explico en el apartado 4).

---

## 3. 🎯 Tu ejemplo concreto

Quieres validar un campo (por ejemplo, una contraseña) con estas reglas:

- Mínimo **5** caracteres
- Máximo **12** caracteres
- Al menos **1 mayúscula**
- Al menos **1 minúscula**
- Al menos un **`-`**
- Ningún **`?`**

### Lo ÚNICO que tienes que tocar: el objeto de reglas

```js
const REGLAS_PASSWORD = {
  password: {
    etiqueta: "La contraseña",
    obligatorio: true,                 // no vacío
    longitudMin: 5,                    // mínimo 5
    longitudMax: 12,                   // máximo 12
    caracteresObligatorios: ["-"],     // debe llevar al menos un "-"
    caracteresProhibidos: ["?"],       // no puede llevar "?"
    regex: /^(?=.*[A-Z])(?=.*[a-z]).*$/, // al menos 1 mayúscula Y 1 minúscula
    mensajeRegex: "al menos una mayúscula y una minúscula",
  },
};
```

**No tocas nada más.** Ni `validarCampo`, ni `validarFormulario`. Solo este objeto.

### ¿Por qué cada requisito va donde va?

| Requisito | Opción usada | Por qué |
|---|---|---|
| Mínimo 5 | `longitudMin: 5` | Opción directa |
| Máximo 12 | `longitudMax: 12` | Opción directa |
| Al menos un `-` | `caracteresObligatorios: ["-"]` | El `-` es un carácter **concreto** → se comprueba con `includes` |
| Ningún `?` | `caracteresProhibidos: ["?"]` | Carácter concreto prohibido |
| Al menos 1 mayúscula | `regex` con `(?=.*[A-Z])` | "una mayúscula **cualquiera**" no es un carácter fijo → hace falta regex |
| Al menos 1 minúscula | `regex` con `(?=.*[a-z])` | Igual: "una minúscula cualquiera" → regex |

> 🔑 **Clave:** `caracteresObligatorios` sirve para caracteres **exactos** (`-`, `_`, `#`...). Para "al menos una mayúscula/minúscula/número" (cualquiera del grupo) se usa `regex`, porque no es un carácter fijo sino un **conjunto**.

### El truco del `regex` con *lookaheads*

Como solo hay un `regex` por campo, las dos condiciones ("1 mayúscula" + "1 minúscula") se juntan así:

```
/^(?=.*[A-Z])(?=.*[a-z]).*$/
   │  │         │
   │  │         └── (?=.*[a-z])  → "existe en algún sitio una minúscula"
   │  └──────────── (?=.*[A-Z])  → "existe en algún sitio una mayúscula"
   └─────────────── ^ ... $ .*   → recorre toda la cadena
```

Cada `(?=...)` es un "vistazo" que comprueba una condición **sin consumir** caracteres, así que puedes encadenar todas las que quieras.

---

## 4. Recetario de `regex` (copia y pega)

| Quiero... | `regex` |
|---|---|
| Al menos 1 mayúscula | `/[A-Z]/` |
| Al menos 1 minúscula | `/[a-z]/` |
| Al menos 1 número | `/[0-9]/` |
| Mayúscula **y** minúscula | `/^(?=.*[A-Z])(?=.*[a-z]).*$/` |
| Al menos **2** mayúsculas | `/^(?=(?:.*[A-Z]){2}).*$/` |
| Mayúscula + minúscula + número | `/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/` |
| Solo letras (sin números ni símbolos) | `/^[a-zA-ZáéíóúñÁÉÍÓÚÑ ]+$/` |
| Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Número (admite decimales) | `/^\d+([.,]\d+)?$/` |

> Para "al menos un `-`" o "ningún `?`" **no uses regex**: es más simple con `caracteresObligatorios` / `caracteresProhibidos`.

---

## 5. Cómo conectarlo a un formulario (4 pasos)

Es exactamente el patrón que ya usan `ProductoCrear.jsx` y `ProductoEditar.jsx`.

```jsx
import { useState } from "react";
import { validarFormulario } from "../Toolkit/validaciones";

// 1) Definir las reglas (lo único que cambias entre formularios)
const REGLAS_PASSWORD = {
  password: {
    etiqueta: "La contraseña",
    obligatorio: true,
    longitudMin: 5,
    longitudMax: 12,
    caracteresObligatorios: ["-"],
    caracteresProhibidos: ["?"],
    regex: /^(?=.*[A-Z])(?=.*[a-z]).*$/,
    mensajeRegex: "al menos una mayúscula y una minúscula",
  },
};

const MiFormulario = () => {
  const [form, setForm] = useState({ password: "" });
  const [errores, setErrores] = useState({});   // 2) estado para los errores

  const handleSubmit = (e) => {
    e.preventDefault();

    // 3) Validar pasando los datos y las reglas
    const { valido, errores } = validarFormulario(form, REGLAS_PASSWORD);

    if (!valido) {
      setErrores(errores);   // guardamos los mensajes para pintarlos
      return;                // y no enviamos
    }

    setErrores({});
    // ...aquí el envío real (todo correcto)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {/* 4) Mostrar el error del campo si existe */}
      {errores.password && <p className="error-message">{errores.password}</p>}

      <button type="submit">Enviar</button>
    </form>
  );
};
```

---

## 6. Qué mensaje se ve

Los fallos se **agrupan en un solo texto**. Para el ejemplo, si escribes `ab?` verías algo como:

> **La contraseña debe tener** mínimo 5 caracteres **y** debe contener: - **y** no puede contener: ? **y** al menos una mayúscula y una minúscula

Cuando el campo es correcto, `validarCampo` devuelve `null` y `validarFormulario` lo deja fuera de `errores`.

---

## 7. Errores típicos a evitar

1. **Usar `caracteresObligatorios: ["A"]` para "una mayúscula"** → eso exige la letra `A` exacta, no "cualquier mayúscula". Para cualquiera, usa `regex: /[A-Z]/`.
2. **Querer dos `regex` en el mismo campo** → no se puede; combínalos con *lookaheads* `(?=...)`.
3. **Olvidar `mensajeRegex`** → si el `regex` falla y no pones mensaje, sale el texto genérico `"formato no válido"`.
4. **Campos numéricos** → el valor llega como texto; valida con `regex: /^\d+([.,]\d+)?$/` y conviértelo con `Number(...)` al enviar.
5. **Campo opcional** → si `obligatorio` es `false` o no lo pones, un valor vacío se considera válido (no se le aplican el resto de reglas).

---

## 8. Resumen de una frase

Para validar un formulario nuevo, **crea un objeto de reglas** (como `REGLAS_PASSWORD`) y pásalo a `validarFormulario(datos, reglas)`. **Nunca tocas la lógica del validador**, solo ese objeto.
