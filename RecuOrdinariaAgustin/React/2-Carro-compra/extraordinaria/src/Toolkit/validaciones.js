


// ----------------------------------------------------------------------------
//  CONSTANTES REUTILIZABLES (cámbialas y afecta a todas las reglas que las usen)
// ----------------------------------------------------------------------------
export const SIN_NUMEROS = /^[^0-9]*$/;          // texto sin dígitos
export const SOLO_NUMEROS_DECIMAL = /^\d+([.,]\d+)?$/; // número (admite decimales)
export const URL_IMAGEN = /\.(jpg|jpeg|png|webp|gif|svg)$/i; // termina en imagen


// ----------------------------------------------------------------------------
//  VALIDADOR DE UN ÚNICO CAMPO
//  Recibe el valor y su regla. Devuelve un string con TODOS los fallos
//  agrupados, o null si el campo es válido.
// ----------------------------------------------------------------------------
export const validarCampo = (valor, regla = {}) => {
  const fallos = [];
  const texto = valor === undefined || valor === null ? "" : String(valor);
  const etiqueta = regla.etiqueta || "El campo";

  // 1) Obligatorio
  if (regla.obligatorio && texto.trim() === "") {
    return `${etiqueta} es obligatorio`; // si está vacío no seguimos comprobando
  }

  // Si NO es obligatorio y está vacío, lo damos por válido
  if (!regla.obligatorio && texto.trim() === "") {
    return null;
  }

  // 2) Longitud mínima
  if (regla.longitudMin !== undefined && texto.length < regla.longitudMin) {
    fallos.push(`mínimo ${regla.longitudMin} caracteres`);
  }

  // 3) Longitud máxima
  if (regla.longitudMax !== undefined && texto.length > regla.longitudMax) {
    fallos.push(`máximo ${regla.longitudMax} caracteres`);
  }

  // 4) Caracteres obligatorios (todos deben aparecer)
  if (Array.isArray(regla.caracteresObligatorios)) {
    const faltan = regla.caracteresObligatorios.filter((c) => !texto.includes(c));
    if (faltan.length > 0) {
      fallos.push(`debe contener: ${faltan.join(" ")}`);
    }
  }

  // 5) Caracteres prohibidos (ninguno puede aparecer)
  if (Array.isArray(regla.caracteresProhibidos)) {
    const presentes = regla.caracteresProhibidos.filter((c) => texto.includes(c));
    if (presentes.length > 0) {
      fallos.push(`no puede contener: ${presentes.join(" ")}`);
    }
  }

  // 6) Expresión regular personalizada
  if (regla.regex instanceof RegExp && !regla.regex.test(texto)) {
    fallos.push(regla.mensajeRegex || "formato no válido");
  }

  if (fallos.length === 0) return null;

  // Mensajes agrupados en un único texto
  return `${etiqueta} debe tener ${fallos.join(" y ")}`;
};


// ----------------------------------------------------------------------------
//  VALIDADOR DE UN FORMULARIO COMPLETO
//  datos  -> { nombre: "...", precio: "...", ... }
//  reglas -> { nombre: {regla}, precio: {regla}, ... }
//  Devuelve { valido: boolean, errores: { campo: mensaje } }
// ----------------------------------------------------------------------------
export const validarFormulario = (datos = {}, reglas = {}) => {
  const errores = {};

  Object.keys(reglas).forEach((campo) => {
    const error = validarCampo(datos[campo], reglas[campo]);
    if (error) {
      errores[campo] = error;
    }
  });

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
};


// ----------------------------------------------------------------------------
//  CONFIGURACIÓN DE EJEMPLO PARA EL FORMULARIO DE VIDEOJUEGOS
//  >>> ESTO es lo único que tocarías en un examen para cambiar las reglas <<<
// ----------------------------------------------------------------------------
export const REGLAS_JUEGO = {
  nombre: {
    etiqueta: "El nombre",
    obligatorio: true,
    longitudMin: 2,
    longitudMax: 60,
  },
  precio: {
    etiqueta: "El precio",
    obligatorio: true,
    regex: SOLO_NUMEROS_DECIMAL,
    mensajeRegex: "un número válido (ej. 19.99)",
  },
  url: {
    etiqueta: "La imagen",
    obligatorio: true,
    regex: URL_IMAGEN,
    mensajeRegex: "una ruta de imagen válida (.jpg, .png, ...)",
  },
  categoria: {
    etiqueta: "La categoría",
    obligatorio: true,
    longitudMin: 3,
    longitudMax: 30,
  },
  descripcion: {
    etiqueta: "La descripción",
    obligatorio: true,
    longitudMin: 10,
    longitudMax: 300,
  },
};
