import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { validarFormulario, REGLAS_JUEGO } from '../../Toolkit/validaciones';

// Formulario para AÑADIR un videojuego nuevo.
// Recibe onCrear: una función del padre (Administracion) a la que le
// entregamos el videojuego ya validado.
const ProductoCrear = ({ onCrear }) => {

  // Estado del formulario: un objeto con todos los campos del videojuego
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    url: "",
    categoria: "",
    descripcion: "",
  });

  // Errores de validación por campo
  const [errores, setErrores] = useState({});

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

    // Validación reutilizable: solo dependemos de REGLAS_JUEGO
    const { valido, errores } = validarFormulario(form, REGLAS_JUEGO);
    if (!valido) {
      setErrores(errores);
      Swal.fire({
        title: "Revisa el formulario",
        text: "Hay campos que no cumplen las reglas",
        icon: "warning",
      });
      return;
    }

    setErrores({});

    // Avisamos al padre con el videojuego listo (precio como número)
    onCrear({
      nombre: form.nombre,
      precio: Number(String(form.precio).replace(",", ".")),
      url: form.url,
      categoria: form.categoria,
      descripcion: form.descripcion,
      ocasion: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-crear">
      <h3>Añadir videojuego</h3>

      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={gestionarCambio}
        />
        {errores.nombre && <p className="error-message">{errores.nombre}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="text"
          value={form.precio}
          onChange={gestionarCambio}
        />
        {errores.precio && <p className="error-message">{errores.precio}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoría</label>
        <input
          id="categoria"
          name="categoria"
          value={form.categoria}
          onChange={gestionarCambio}
          placeholder="RPG, Shooter, Aventura..."
        />
        {errores.categoria && <p className="error-message">{errores.categoria}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="url">URL de la imagen</label>
        <input
          id="url"
          name="url"
          value={form.url}
          onChange={gestionarCambio}
          placeholder="./imagenes/elden-ring.jpg"
        />
        {errores.url && <p className="error-message">{errores.url}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={gestionarCambio}
          rows={3}
        />
        {errores.descripcion && <p className="error-message">{errores.descripcion}</p>}
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default ProductoCrear;
